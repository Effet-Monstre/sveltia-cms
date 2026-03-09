import { createGitBackend } from '$lib/services/backends/git/generic';
import { getBlob, getGitHash } from '$lib/services/utils/file';

/**
 * @import { CommitResults } from '$lib/types/private';
 */

/**
 * @typedef {{ handle: string, content?: any }} ApiEntry
 */

/**
 * Returns the CSRF token from the page meta tag.
 * @returns {string}
 */
const getCsrfToken = () =>
  /** @type {HTMLMetaElement | null} */ (document.querySelector('meta[name=csrf-token]'))
    ?.content ?? '';

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
 * Fetch all entries from the API.
 * @returns {Promise<ApiEntry[]>}
 */
const apiAll = async () => {
  const response = await fetch('/admin/entries', {
    headers: { 'X-CSRF-Token': getCsrfToken() },
  });

  const { entries } = await response.json();

  return entries;
};

/**
 * Write a file to the API (create or update).
 * @param {string} path File path (handle).
 * @param {{ file?: Blob, content?: string }} data File data.
 */
const apiWrite = async (path, { file, content }) => {
  const formData = new FormData();

  formData.append('entry[handle]', path);

  if (file) formData.append('entry[file]', file);
  if (content !== undefined) formData.append('entry[content]', content);

  await fetch('/admin/entries', {
    method: 'POST',
    body: formData,
    headers: { 'X-CSRF-Token': getCsrfToken() },
  });
};

/**
 * Delete a file from the API.
 * @param {string} path File path (handle).
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
   * Fetch the complete file list from the API. Inline content (when present) is used to compute
   * a per-file SHA so the generic adapter can skip unchanged files on subsequent loads.
   * Binary-only entries (assets) return no SHA and are fetched on demand via `fetchBlob`.
   */
  async getFileList() {
    _entries = await apiAll();

    return Promise.all(
      _entries.map(async ({ handle, content }) => {
        const text = contentToText(content);

        return {
          path: handle,
          // Providing a real SHA enables per-file IndexedDB caching: only files whose SHA changed
          // will be re-parsed on the next load. Assets have no inline content → no SHA → fetched
          // on demand, cached with an empty SHA placeholder.
          sha: text !== undefined ? await getGitHash(text) : undefined,
        };
      }),
    );
  },

  /**
   * Return the text content for the given paths from the already-fetched entry list.
   * Since `apiAll` returns content inline, no second network request is needed.
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
   * Fetch a binary asset blob on demand. Resolves the asset URL from the API then fetches it.
   * @param {string} path Asset path (handle).
   * @returns {Promise<Blob>}
   */
  async fetchBlob(path) {
    const response = await fetch(
      `/admin/entries/show?handle=${encodeURIComponent(path)}`,
      { headers: { 'X-CSRF-Token': getCsrfToken() } },
    );

    const { entry: { file_url } } = await response.json();

    return fetch(file_url).then((r) => r.blob());
  },

  /**
   * Persist file changes via the API and return commit results with computed SHAs.
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

          await apiWrite(path, isText ? { content: data } : { file: /** @type {Blob} */ (data) });

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
