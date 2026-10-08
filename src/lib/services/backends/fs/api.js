import { loadFiles, saveChanges } from '$lib/services/backends/fs/shared/files2';
import { getDirectoryHandle } from '$lib/services/backends/fs/shared/handles';
import { dataLoaded } from '$lib/services/contents';

/**
 * @import { Asset, BackendService, CommitResults, FileChange, User } from '$lib/types/private';
 */

/**
 * Name of the directory in the origin private file system (OPFS) used as a scratch space for the
 * files the host application serves.
 */
const ROOT_DIR_NAME = 'sveltia-cms-test';

/**
 * Name of the `api` backend.
 */
export const API_BACKEND_NAME = 'api';

const label = 'Api mode';
/**
 * @type {FileSystemDirectoryHandle | undefined}
 */
let rootDirHandle = undefined;
/**
 * Initialize the `api` backend. There is nothing to do here.
 * @returns {undefined} Nothing.
 */
const init = () => undefined;

/**
 * Sign in with the `api` backend. There is no actual sign-in; the host application has already
 * authenticated the user, so just get the root directory handle in the origin private file system
 * (OPFS), which is used as a scratch space.
 * @returns {Promise<User>} User info. Since we don’t have any details for the user, just return the
 * backend name.
 */
const signIn = async () => {
  try {
    rootDirHandle = await getDirectoryHandle(await navigator.storage.getDirectory(), ROOT_DIR_NAME);
  } catch {
    // Directory handle could not be acquired for security reasons, but we can ignore the error
  }

  return { backendName: API_BACKEND_NAME };
};

/**
 * Sign out from the `api` backend. There is nothing to do here.
 */
const signOut = async () => {};

/**
 * Load the file list and all the entry files from the host application, then cache them in the
 * {@link allEntries} and {@link allAssets} stores. If the root directory handle is not available,
 * simply pretend that the data is loaded.
 */
const fetchFiles = async () => {
  if (rootDirHandle) {
    await loadFiles();
  } else {
    dataLoaded.current = true;
  }
};

/**
 * Save entries or assets in the host application.
 * @param {FileChange[]} changes File changes to be saved.
 * @returns {Promise<CommitResults>} Commit results, including a pseudo commit SHA, saved files, and
 * their blob SHAs.
 */
const commitChanges = async (changes) => saveChanges(rootDirHandle, changes);

/**
 * Read an asset file from the host application. The asset list only carries the paths, so the file
 * URL is looked up first, then the bytes are fetched from it.
 * @param {Asset} asset Asset to be fetched.
 * @returns {Promise<Blob>} Blob.
 */
const fetchBlob = async (asset) => {
  const { path } = asset;

  const token =
    /** @type {HTMLMetaElement | null} */ (document.querySelector('meta[name=csrf-token]'))
      ?.content ?? '';

  const {
    entry: { file_url: fileURL },
  } = await (
    await fetch(`/admin/entries/show?handle=${encodeURIComponent(path)}`, {
      headers: { 'X-CSRF-Token': token },
    })
  ).json();

  const blob = await (await fetch(fileURL)).blob();

  asset.size = blob.size;

  return blob;
};

/**
 * @type {BackendService}
 */
export default {
  isGit: false,
  name: API_BACKEND_NAME,
  label,
  init,
  signIn,
  signOut,
  fetchFiles,
  fetchBlob,
  commitChanges,
};
