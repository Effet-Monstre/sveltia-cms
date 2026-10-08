import { getPathInfo, readAsText } from '@sveltia/utils/file';
import { stripSlashes } from '@sveltia/utils/string';

import { getAssetKind } from '$lib/services/assets/kinds';
import { allAssets } from '$lib/services/assets/state';
import { getDirectoryHandle } from '$lib/services/backends/fs/shared/handles';
import { deleteEmptyParentDirs, moveFile } from '$lib/services/backends/fs/shared/save';
import { gitConfigFiles } from '$lib/services/backends/git/shared/config';
import { createFileList } from '$lib/services/backends/process';
import { allEntries, dataLoaded, entryParseErrors } from '$lib/services/contents';
import { prepareEntries } from '$lib/services/contents/file/process';
import { getBlob, getGitHash } from '$lib/services/utils/file';

/**
 * @import {
 * Asset,
 * BaseAssetListItem,
 * BaseConfigListItem,
 * BaseEntryListItem,
 * BaseFileListItemProps,
 * CommitResults,
 * FileChange,
 * } from '$lib/types/private';
 */

/**
 * Entry or asset as the host application reports it from `GET /admin/entries`.
 * @typedef {object} ApiListItem
 * @property {string} handle Path of the file within the repository.
 * @property {any} [content] Parsed content of an entry file. An asset has none; its bytes are
 * fetched on demand with the `file_url` the host returns for it.
 */

/**
 * File read from the host application, before it’s normalized into a file list item.
 * @typedef {object} ApiFileListItem
 * @property {File} [file] File content, for an entry. An asset has none.
 * @property {string} path Path of the file within the repository.
 */

/**
 * Get the CSRF token of the host application, which every request to it has to carry.
 * @returns {string} Token, or an empty string if the page has no `csrf-token` meta tag.
 */
const getCsrfToken = () =>
  /** @type {HTMLMetaElement | null} */ (document.querySelector('meta[name=csrf-token]'))
    ?.content ?? '';

/**
 * Normalize a file list item to ensure it has the required properties. This function also computes
 * the SHA-1 hash of the file. The file path and name must be normalized, as certain non-ASCII
 * characters (e.g. Japanese) can be problematic particularly on macOS.
 * @param {ApiFileListItem} fileListItem File list item.
 * @returns {Promise<BaseFileListItemProps>} Normalized file list item.
 */
const normalizeFileListItem = async ({ file, path }) => {
  const name = getPathInfo(path).basename;

  return file
    ? {
        // @ts-ignore `file` isn’t part of the upstream type, but it’s passed through to the entry
        // and asset list items, where this backend reads the text from it
        file,
        path: path.normalize(),
        name: file.name.normalize(),
        size: file.size,
        sha: await getGitHash(file),
      }
    : { path: path.normalize(), sha: 'sha', name, size: 10 };
};

/**
 * Parse asset file info to create a complete asset object. An asset served by the host application
 * has no content here, so it’s listed without a size or hash, and its bytes are fetched when the
 * asset is shown.
 * @param {BaseAssetListItem} fileInfo Asset file info.
 * @returns {Promise<Asset>} Asset object.
 */
const parseAssetFileInfo = async (fileInfo) => ({ ...fileInfo, kind: getAssetKind(fileInfo.name) });

/**
 * Read the text content of an entry or config file.
 * @param {BaseEntryListItem | BaseConfigListItem} fileInfo Entry or config file info.
 * @returns {Promise<BaseEntryListItem | BaseConfigListItem>} File info with the text content. The
 * text is left out if the file can’t be read, rather than made empty, so the file isn’t loaded as
 * an empty entry that would wipe its content when saved.
 */
const parseTextFileInfo = async (fileInfo) => {
  const { name } = fileInfo;
  const { file } = /** @type {{ file?: File }} */ (fileInfo);

  // Skip `.gitkeep` file, as we don’t need to read its content
  if (name === '.gitkeep' || !file) {
    return fileInfo;
  }

  try {
    return { ...fileInfo, text: await readAsText(file) };
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);

    return fileInfo;
  }
};

/**
 * Write a file to the host application. An entry is sent as text, an asset as a file.
 * @param {string} path Path of the file within the repository.
 * @param {object} args Arguments.
 * @param {File | Blob} [args.file] Asset content.
 * @param {string} [args.content] Entry content.
 */
const apiWrite = async (path, { file, content }) => {
  const formData = new FormData();

  formData.append('entry[handle]', path);

  if (file) {
    formData.append('entry[file]', file);
  }

  if (content !== undefined) {
    formData.append('entry[content]', content);
  }

  await fetch('/admin/entries', {
    method: 'POST',
    body: formData,
    headers: { 'X-CSRF-Token': getCsrfToken() },
  });
};

/**
 * Delete a file from the host application.
 * @param {string} path Path of the file within the repository.
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

/**
 * List every entry and asset the host application holds.
 * @returns {Promise<ApiListItem[]>} File list.
 */
const apiAll = async () => {
  const response = await fetch('/admin/entries', {
    headers: { 'X-CSRF-Token': getCsrfToken() },
  });

  const { entries } = await response.json();

  return entries ?? [];
};

/**
 * Load the file list and all the entry files from the host application, then cache them in the
 * stores, the way the file system backends do with a local directory.
 * @returns {Promise<void>} Nothing.
 */
export const loadFiles = async () => {
  const files = await Promise.all(
    (await apiAll()).map(({ handle, content }) =>
      normalizeFileListItem(
        content === undefined || content === null
          ? { path: handle }
          : { file: new File([JSON.stringify(content)], handle), path: handle },
      ),
    ),
  );

  const { entryFiles, assetFiles, configFiles } = createFileList(files);

  const entryFileItems = /** @type {BaseEntryListItem[]} */ (
    await Promise.all(entryFiles.map(parseTextFileInfo))
  );

  const configFileItems = /** @type {BaseConfigListItem[]} */ (
    await Promise.all(configFiles.map(parseTextFileInfo))
  );

  const { entries, errors } = await prepareEntries(entryFileItems);
  const assets = await Promise.all(assetFiles.map(parseAssetFileInfo));

  allEntries.current = entries;
  allAssets.current = assets;
  gitConfigFiles.current = configFileItems;
  entryParseErrors.current = errors;
  dataLoaded.current = true;
};

/**
 * Write a file to the host application, and return it as the saved file.
 * @param {object} args Arguments.
 * @param {string} args.path Path of the file within the repository.
 * @param {string | File} args.data Content to write.
 * @returns {Promise<File>} Written file.
 */
const writeFile = async ({ path, data }) => {
  try {
    if (typeof data === 'string') {
      await apiWrite(path, { content: data });
    } else {
      await apiWrite(path, { file: data });
    }
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);
  }

  return new File([data], path);
};

/**
 * Delete a file from the host application, and from the local copy in the origin private file
 * system if there is one.
 * @param {object} args Arguments.
 * @param {FileSystemDirectoryHandle} args.rootDirHandle Root directory handle.
 * @param {string} args.path Path of the file within the repository.
 */
const deleteFile = async ({ rootDirHandle, path }) => {
  const { dirname: dirPath = '', basename: fileName } = getPathInfo(stripSlashes(path));

  await apiDelete(path);

  try {
    const dirHandle = await getDirectoryHandle(rootDirHandle, dirPath);

    await dirHandle.removeEntry(fileName);

    if (dirPath) {
      await deleteEmptyParentDirs(rootDirHandle, dirPath.split('/'));
    }
  } catch {
    // The file only lives in the host application, so there may be nothing to remove here
  }
};

/**
 * Save a file to the host application based on the provided change options.
 * @param {FileSystemDirectoryHandle} rootDirHandle Root directory handle.
 * @param {FileChange} change File change options.
 * @returns {Promise<?File>} Created or updated file, if available.
 * @throws {Error} If an error occurs while saving the file.
 */
const saveChange = async (rootDirHandle, { action, path, previousPath, data }) => {
  if (action === 'move' && previousPath) {
    try {
      await moveFile({ rootDirHandle, previousPath, path });
    } catch {
      // The file only lives in the host application, so there may be nothing to move here
    }
  }

  // An empty string is still written, as an emptied file mustn’t keep its old content
  if (['create', 'update', 'move'].includes(action) && data !== undefined) {
    return writeFile({ path, data });
  }

  if (action === 'delete') {
    await deleteFile({ rootDirHandle, path });
  }

  return null;
};

/**
 * Save entries or assets in the host application.
 * @param {FileSystemDirectoryHandle | undefined} rootDirHandle Root directory handle. This can be
 * `undefined` if the directory handle could not be acquired earlier for security reasons. If the
 * handle is not available, the changes will not be saved, but the user can still continue using the
 * app without an error thanks to the in-memory cache.
 * @param {FileChange[]} changes File changes to be saved.
 * @returns {Promise<CommitResults>} Commit results, including a pseudo commit SHA, saved files, and
 * their blob SHAs.
 */
export const saveChanges = async (rootDirHandle, changes) => {
  const entries = await Promise.all(
    changes.map(async (change) => {
      const { path, data } = change;
      /** @type {Blob | null} */
      let file = null;

      if (rootDirHandle) {
        try {
          file = await saveChange(rootDirHandle, change);
        } catch (ex) {
          // eslint-disable-next-line no-console
          console.error(ex);
        }
      }

      if (!file) {
        if (data === undefined) {
          return null;
        }

        file = getBlob(data);
      }

      return /** @type {[string, { file: Blob, sha: string }]} */ ([
        path,
        { file, sha: await getGitHash(file) },
      ]);
    }),
  );

  return {
    // Use a hash of the current date as a pseudo SHA
    sha: await getGitHash(new Date().toJSON()),
    files: Object.fromEntries(entries.filter((entry) => !!entry)),
  };
};
