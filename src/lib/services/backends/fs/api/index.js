import { createGitBackend } from '$lib/services/backends/git/generic';
import { getBlob, getGitHash } from '$lib/services/utils/file';

/**
 * @import { CommitResults } from '$lib/types/private';
 */

/**
 * @typedef {{ handle: string, content?: any, version?: number, published_at?: string | null }} ApiEntry
 */

/**
 * Returns the CSRF token from the page meta tag.
 * @returns {string}
 */
const getCsrfToken = () =>
  /** @type {HTMLMetaElement | null} */ (document.querySelector('meta[name=csrf-token]'))
    ?.content ?? '';

/**
 * Read the cms-versions meta tag injected by CmsController#internal.
 * Returns an array of [handle, version] pairs, or empty array when not present.
 * @returns {[string, number][]}
 */
const getPinnedVersions = () => {
  const meta = /** @type {HTMLMetaElement | null} */ (
    document.querySelector('meta[name=cms-versions]')
  );
  if (!meta?.content) return [];
  try {
    return JSON.parse(meta.content);
  } catch {
    return [];
  }
};

/**
 * Returns the pinned version number for a given handle, or undefined if not pinned.
 * @param {string} handle
 * @returns {number | undefined}
 */
const getPinnedVersionForHandle = (handle) => getPinnedVersions().find(([h]) => h === handle)?.[1];

/**
 * Serialize entry content to a text string, or return `undefined` for binary-only entries.
 * @param {any} content Raw content value from the API.
 * @returns {string | undefined}
 */
const contentToText = (content) => {
  if (content === undefined) return undefined;
  return typeof content === 'string' ? content : JSON.stringify(content);
};

/**
 * Fetch all entries from the API (highest version per handle by default).
 * When pinnedVersions is non-empty, the backend selects the specified version
 * for each pinned handle and falls back to highest version for the rest.
 * @param {[string, number][]} pinnedVersions
 * @returns {Promise<ApiEntry[]>}
 */
const apiAll = async (pinnedVersions = []) => {
  const url = new URL('/admin/entries', window.location.origin);
  if (pinnedVersions.length) {
    url.searchParams.set('cms_versions', JSON.stringify(pinnedVersions));
  }
  const response = await fetch(url.toString(), {
    headers: { 'X-CSRF-Token': getCsrfToken() },
  });

  const { entries } = await response.json();

  return entries;
};

/**
 * Write a file to the API (create or update).
 * Appends `entry[version]` to the FormData when `version` is provided so the controller
 * writes to that specific version row (pinned-version mode).
 * @param {string} path File path (handle).
 * @param {{ file?: Blob, content?: string }} data File data.
 * @param {number | undefined} version Optional version number.
 */
const apiWrite = async (path, { file, content }, version) => {
  const formData = new FormData();

  formData.append('entry[handle]', path);

  if (file) formData.append('entry[file]', file);
  if (content !== undefined) formData.append('entry[content]', content);
  if (version !== undefined) formData.append('entry[version]', String(version));

  await fetch('/admin/entries', {
    method: 'POST',
    body: formData,
    headers: { 'X-CSRF-Token': getCsrfToken() },
  });
};

/**
 * Delete a file from the API.
 * @param {string} path Asset path (handle).
 */
const apiDelete = async (path) => {
  await fetch('/admin/entries', {
    method: 'DELETE',
    body: JSON.stringify({ handle: path }),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(),
    },
  });
};

// Holds the full entry list fetched in `getFileList` so that `fetchBlobs` can read inline
// content without a second API request.
/** @type {ApiEntry[] | null} */
let _entries = null;

export default createGitBackend({
  name: 'api',
  label: 'API',

  /**
   * Fetch the file list from the API.
   *
   * Fetches all entries, forwarding the cms-versions array so the backend selects
   * pinned versions per handle and falls back to the highest version for the rest.
   */
  async getFileList() {
    _entries = await apiAll(getPinnedVersions());

    return Promise.all(
      _entries.map(async ({ handle, content }) => {
        const text = contentToText(content);

        return {
          path: handle,
          sha: text !== undefined ? await getGitHash(text) : undefined,
        };
      }),
    );
  },

  /**
   * Return the text content for the given paths from the already-fetched entry list.
   * @param {string[]} paths
   */
  async fetchBlobs(paths) {
    return Object.fromEntries(
      paths.map((path) => {
        const entry = _entries?.find((e) => e.handle === path);
        const text = contentToText(entry?.content) ?? '';

        return [path, { text }];
      }),
    );
  },

  /**
   * Fetch a binary asset blob on demand.
   * In pinned-version mode, appends &version=N to the show URL for the pinned handle.
   * @param {string} path Asset path (handle).
   * @returns {Promise<Blob>}
   */
  async fetchBlob(path) {
    const version = getPinnedVersionForHandle(path);
    const url =
      version !== undefined
        ? `/admin/entries/show?handle=${encodeURIComponent(path)}&version=${version}`
        : `/admin/entries/show?handle=${encodeURIComponent(path)}`;

    const response = await fetch(url, { headers: { 'X-CSRF-Token': getCsrfToken() } });

    const {
      entry: { file_url },
    } = await response.json();

    return fetch(file_url).then((r) => r.blob());
  },

  /**
   * Persist file changes via the API and return commit results with computed SHAs.
   * In pinned-version mode, the version number is forwarded to the controller so the
   * correct version row is updated.
   * @param {import('$lib/types/private').FileChange[]} changes
   * @returns {Promise<CommitResults>}
   */
  async commitChanges(changes) {
    const results = await Promise.all(
      changes.map(async ({ action, path, previousPath, data }) => {
        if (action === 'delete') {
          await apiDelete(path);

          return null;
        }

        if (data !== undefined) {
          const isText = typeof data === 'string';
          const version = getPinnedVersionForHandle(path);

          await apiWrite(
            path,
            isText ? { content: data } : { file: /** @type {Blob} */ (data) },
            version,
          );

          // For moves, delete the old path after writing the new one
          if (action === 'move' && previousPath) {
            await apiDelete(previousPath);
          }

          const blob = getBlob(data);

          return [path, { file: blob, sha: await getGitHash(blob) }];
        }

        return null;
      }),
    );

    return /** @type {CommitResults} */ ({
      sha: await getGitHash(new Date().toJSON()),
      files: Object.fromEntries(/** @type {[string, any][]} */ (results.filter((r) => r !== null))),
    });
  },
});
