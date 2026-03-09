import { getHash } from '@sveltia/utils/crypto';
import { getPathInfo } from '@sveltia/utils/file';

import { fetchAndParseFiles } from '$lib/services/backends/git/shared/fetch';
import { REPOSITORY_INFO_PLACEHOLDER } from '$lib/services/backends/git/shared/repository';
import { getGitHash } from '$lib/services/utils/file';

/**
 * @import { BaseFileListItem, BaseFileListItemProps, RepositoryContentsMap } from '$lib/types/private';
 */

/**
 * @typedef {{ path: string, sha?: string }} AdapterFileEntry
 * A file entry returned by the adapter's getFileList.
 */

/**
 * @typedef {{ text?: string, size?: number } | string} AdapterBlobValue
 * A blob value returned by the adapter's fetchBlobs. Can be a plain string (raw text content)
 * or an object with optional text and size fields.
 */

/**
 * @typedef {object} GenericGitAdapter
 * Minimal interface required to implement a new Git-compatible backend.
 *
 * **Required:**
 * @property {string} name
 * Unique backend identifier used as the IndexedDB database namespace.
 * @property {string} label
 * Human-readable label for the backend (shown in the UI).
 * @property {() => Promise<AdapterFileEntry[]>} getFileList
 * Returns the full flat file list for the source. The `sha` field is optional — if absent, the
 * factory computes a Git SHA-1 hash from the file content after fetching. Providing real SHAs
 * enables per-file caching: files whose SHA matches the cache are never re-fetched.
 * @property {(paths: string[]) => Promise<Record<string, AdapterBlobValue>>} fetchBlobs
 * Bulk-fetches text content for the given file paths. Only non-asset paths are passed. Values can
 * be a plain string (raw text) or an object with `text` and optional `size`.
 *
 * **Optional:**
 * @property {(path: string) => Promise<Blob>} [fetchBlob]
 * Fetches binary asset content on demand. If absent, `BackendService.fetchBlob` is `undefined`
 * and binary assets cannot be loaded.
 * @property {() => Promise<string>} [getCommitHash]
 * Returns a string representing the current state (e.g. a commit SHA or ETag). Used as the
 * IndexedDB cache invalidation key. If absent, a pseudo-hash is derived from the file list —
 * which means cache only invalidates when files are added/removed, not when content changes
 * without path changes. Adapters that cannot provide per-file SHAs should implement this.
 * @property {() => Promise<string>} [getDefaultBranch]
 * Returns the default branch name. Defaults to `'main'` if absent.
 * @property {(changes: any[], options: any) => Promise<any>} [commitChanges]
 * Implements write support. If absent, `commitChanges` throws a "not implemented" error.
 */

/**
 * Create a fully `BackendService`-compatible Git backend from a minimal adapter object.
 *
 * The factory wires the adapter's `getFileList` and `fetchBlobs` into the existing shared
 * `fetchAndParseFiles` orchestration, which handles IndexedDB caching, per-file SHA comparison,
 * entry/asset parsing, and Svelte store updates.
 *
 * ### Caching behaviour
 * - If the adapter provides `sha` in `getFileList`, files with unchanged SHAs are served from
 *   IndexedDB and never re-fetched.
 * - If `sha` is absent, a Git SHA-1 hash is computed from the fetched content and stored in the
 *   cache so that subsequent fetches can benefit from per-file caching.
 * - The overall cache is invalidated via `getCommitHash` (or a pseudo-hash derived from the
 *   file list when that is not provided).
 *
 * ### Cycle cache
 * When `getCommitHash` is absent, `getFileList` must be called to derive the cache key. Since
 * `fetchAndParseFiles` calls `fetchLastCommit` before `fetchFileList`, a closure-scoped cache
 * ensures the adapter's `getFileList` is only called once per `fetchFiles()` invocation.
 *
 * @param {GenericGitAdapter} adapter The adapter object.
 * @returns {import('$lib/types/private').BackendService} A `BackendService`-compatible backend.
 */
export const createGitBackend = (adapter) => {
  /** @type {import('$lib/types/private').RepositoryInfo} */
  const repository = { ...REPOSITORY_INFO_PLACEHOLDER };

  // Cycle-scoped cache of the raw file list. Populated lazily in the first call to
  // `_getOrFetchFileList()` within a fetch cycle, then reset at the start of each `fetchFiles()`.
  /** @type {{ raw: AdapterFileEntry[] } | null} */
  let _cycleFileList = null;

  /**
   * Returns the adapter's file list, fetching it from the adapter at most once per fetch cycle.
   * @returns {Promise<AdapterFileEntry[]>}
   */
  const _getOrFetchFileList = async () => {
    if (!_cycleFileList) {
      _cycleFileList = { raw: await adapter.getFileList() };
    }

    return _cycleFileList.raw;
  };

  /**
   * Returns the default branch name from the adapter, or `'main'` as a fallback.
   * Also updates the repository object so subsequent code can read it.
   * @returns {Promise<string>}
   */
  const fetchDefaultBranchName = async () => {
    const branch = adapter.getDefaultBranch ? await adapter.getDefaultBranch() : 'main';

    Object.assign(repository, { branch });

    return branch;
  };

  /**
   * Returns a cache-invalidation hash and a commit message.
   *
   * - If the adapter provides `getCommitHash`, its result is used directly.
   * - Otherwise, a pseudo-hash is derived by hashing the sorted `path:sha` pairs from the file
   *   list. This means the cache invalidates whenever a file is added, removed, or its SHA
   *   changes — but NOT when content changes silently without an updated SHA.
   * @returns {Promise<{ hash: string, message: string }>}
   */
  const fetchLastCommit = async () => {
    if (adapter.getCommitHash) {
      return { hash: await adapter.getCommitHash(), message: '' };
    }

    const files = await _getOrFetchFileList();

    const canonical = files
      .map(({ path, sha }) => `${path}:${sha ?? ''}`)
      .sort()
      .join('\n');

    const hash = await getHash(canonical);

    return { hash, message: '' };
  };

  /**
   * Returns the full file list in the format expected by `fetchAndParseFiles`.
   *
   * Uses the cycle cache populated by `fetchLastCommit` (in the no-`getCommitHash` case) to
   * avoid calling the adapter's `getFileList` twice per fetch cycle.
   *
   * Files without a `sha` get `sha: ''`. This ensures they are never matched by
   * `restoreCachedFileData` (which requires an exact SHA match), so they are always included in
   * the fetch batch. After content is fetched, a real SHA is patched in by `fetchFileContents`
   * and stored in IndexedDB — enabling caching on subsequent cycles.
   * @returns {Promise<BaseFileListItemProps[]>}
   */
  const fetchFileList = async () => {
    const files = await _getOrFetchFileList();

    return files.map(({ path, sha }) => ({
      path,
      sha: sha ?? '',
      size: 0,
      name: getPathInfo(path).basename,
    }));
  };

  /**
   * Fetches text content for uncached files via the adapter's `fetchBlobs`, then patches in
   * computed Git SHA-1 hashes for any files that the adapter did not provide a `sha` for.
   *
   * Asset files are skipped — they carry no text content and are fetched individually on demand
   * via `fetchBlob`.
   * @param {BaseFileListItem[]} fetchingFiles Files that were not restored from cache.
   * @returns {Promise<RepositoryContentsMap>}
   */
  const fetchFileContents = async (fetchingFiles) => {
    const textFiles = fetchingFiles.filter(({ type }) => type !== 'asset');
    const textPaths = textFiles.map(({ path }) => path);

    const blobResults = textPaths.length ? await adapter.fetchBlobs(textPaths) : {};

    const entries = await Promise.all(
      fetchingFiles.map(async ({ path, sha, type }) => {
        if (type === 'asset') {
          // Assets carry no inline text; size and content are resolved on demand via fetchBlob.
          return [path, { sha: sha || '', size: 0, text: undefined, meta: {} }];
        }

        const raw = blobResults[path];
        const text = typeof raw === 'string' ? raw : (raw?.text ?? '');
        const size =
          typeof raw === 'object' && raw !== null ? (raw.size ?? text.length) : text.length;

        // SHA patching: if the adapter did not provide a sha for this file, compute a Git
        // blob hash from the content. This is written to IndexedDB by updateCache() and matched
        // on the next fetch cycle by restoreCachedFileData(), enabling per-file caching.
        const resolvedSha = sha || (await getGitHash(text));

        return [path, { sha: resolvedSha, size, text, meta: {} }];
      }),
    );

    return Object.fromEntries(entries);
  };

  /**
   * Initialises the repository metadata object. Called once by the backend registry before
   * `fetchFiles` is invoked. Must be called before `fetchFiles` or IndexedDB will have an
   * empty `databaseName`.
   * @returns {import('$lib/types/private').RepositoryInfo}
   */
  const init = () => {
    Object.assign(repository, {
      service: adapter.name,
      label: adapter.label,
      repo: adapter.name,
      // Convention: "backendName:identifier" — mirrors github:owner/repo, gitea:owner/repo, etc.
      databaseName: `${adapter.name}:${adapter.label}`,
    });

    return repository;
  };

  /**
   * Fetches and parses all files, updating the Svelte stores with entries, assets, and config
   * files. Delegates to the shared `fetchAndParseFiles` orchestration, which handles caching,
   * store updates, and error reporting.
   */
  const fetchFiles = async () => {
    // Reset the cycle cache so the next call to _getOrFetchFileList triggers a fresh fetch.
    _cycleFileList = null;

    await fetchAndParseFiles({
      repository,
      fetchDefaultBranchName,
      fetchLastCommit,
      fetchFileList,
      fetchFileContents,
    });
  };

  const { fetchBlob: adapterFetchBlob, commitChanges: adapterCommitChanges } = adapter;

  return {
    isGit: false,
    name: adapter.name,
    label: adapter.label,
    repository,
    init,
    /** No-op: generic backends do not require authentication. */
    // @ts-ignore
    signIn: async () => ({ backendName: adapter.name }),
    /** No-op: generic backends do not require authentication. */
    signOut: async () => {},
    fetchFiles,
    /** Fetch a binary asset blob. Only available if the adapter implements `fetchBlob`. */
    fetchBlob: adapterFetchBlob ? (asset) => adapterFetchBlob(asset.path) : undefined,
    /** Commit file changes. Only available if the adapter implements `commitChanges`. */
    commitChanges: adapterCommitChanges
      ? (changes, options) => adapterCommitChanges(changes, options)
      : () => {
          throw new Error(`commitChanges is not implemented by adapter '${adapter.name}'`);
        },
  };
};
