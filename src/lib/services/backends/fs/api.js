import {
  getDirectoryHandle,
  loadFiles,
  saveChanges,
} from '$lib/services/backends/fs/shared/files2';
import { dataLoaded } from '$lib/services/contents';

/**
 * @import { BackendService, CommitResults, FileChange, User } from '$lib/types/private';
 */

const ROOT_DIR_NAME = 'sveltia-cms-test';
const backendName = 'api';
const label = 'Api mode';
/**
 * @type {FileSystemDirectoryHandle | undefined}
 */
let rootDirHandle = undefined;
/**
 * Initialize the test backend. There is nothing to do here.
 * @returns {undefined}
 */
const init = () => undefined;

const signIn = async () => {
  try {
    rootDirHandle = await getDirectoryHandle(await navigator.storage.getDirectory(), ROOT_DIR_NAME);
  } catch {
    // Directory handle could not be acquired for security reasons, but we can ignore the error
  }

  return { backendName };
};

/**
 * Sign out from the test backend. There is nothing to do here.
 */
const signOut = async () => {};

/**
 * Load file list and all the entry files from the file system, then cache them in the
 * {@link allEntries} and {@link allAssets} stores. If the root directory handle is not available,
 * simply pretend that the data is loaded.
 */
const fetchFiles = async () => {
  if (rootDirHandle) {
    await loadFiles(rootDirHandle);
  } else {
    dataLoaded.set(true);
  }
};

/**
 * Save entries or assets in the OPFS using the root directory handle acquired during sign-in. If
 * the handle is not available, do nothing; the data will still be stored in the in-memory cache,
 * allowing the user to continue using the app without an error.
 * @param {FileChange[]} changes File changes to be saved.
 * @returns {Promise<CommitResults>} Commit results, including a pseudo commit SHA, saved files, and
 * their blob SHAs.
 */
const commitChanges = async (changes) => saveChanges(rootDirHandle, changes);

export const fetchBlob = async (asset) => {
  const { path } = asset;
  console.log(asset, path);

  const { file } = await (
    await fetch(`/api/entries/blob?entry[handle]=${encodeURIComponent(path)}`)
  ).json();

  return (await fetch(file)).blob();
};

/**
 * @type {BackendService}
 */
export default {
  isGit: false,
  name: backendName,
  label,
  init,
  signIn,
  signOut,
  fetchFiles,
  fetchBlob,
  commitChanges,
};
