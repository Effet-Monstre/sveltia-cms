import { getPathInfo } from '@sveltia/utils/file';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createGitBackend } from '$lib/services/backends/git/generic/index';
import { createFileList } from '$lib/services/backends/process';
import { prepareEntries } from '$lib/services/contents/file/process';
import { getGitHash } from '$lib/services/utils/file';
import { getHash } from '@sveltia/utils/crypto';

/**
 * Module-level IndexedDB state, reset before each test so each test gets a clean slate.
 * Tests that need a pre-populated cache set these directly before calling `fetchFiles()`.
 */
let metaStoreData = /** @type {Record<string, any>} */ ({});
let fileCacheData = /** @type {[string, any][]} */ ([]);

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@sveltia/utils/crypto', () => ({ getHash: vi.fn() }));
vi.mock('@sveltia/utils/file', () => ({ getPathInfo: vi.fn() }));

vi.mock('@sveltia/utils/storage', () => ({
  // Must use a regular function (not arrow) because Vitest calls mock implementations
  // with `new` when the mock itself is used as a constructor, and arrow functions
  // cannot be called with `new`.
  // eslint-disable-next-line prefer-arrow-callback
  IndexedDB: vi.fn(function mockIndexedDB(_name, store) {
    if (store === 'meta') {
      return {
        get: (/** @type {string} */ key) => Promise.resolve(metaStoreData[key]),
        set: (/** @type {string} */ key, /** @type {any} */ value) => {
          metaStoreData[key] = value;
        },
      };
    }

    // file-cache store
    return {
      entries: () => Promise.resolve(fileCacheData),
      saveEntries: () => {},
      deleteEntries: () => {},
    };
  }),
}));

vi.mock('$lib/services/assets', () => ({ allAssets: { set: vi.fn() } }));
vi.mock('$lib/services/assets/kinds', () => ({ getAssetKind: vi.fn(() => 'image') }));
vi.mock('$lib/services/backends', () => ({ isLastCommitPublished: { set: vi.fn() } }));
vi.mock('$lib/services/backends/git/shared/config', () => ({
  gitConfigFiles: { set: vi.fn() },
}));
vi.mock('$lib/services/backends/process', () => ({ createFileList: vi.fn() }));
vi.mock('$lib/services/contents', () => ({
  allEntries: { set: vi.fn() },
  dataLoaded: { set: vi.fn() },
  entryParseErrors: { set: vi.fn() },
}));
vi.mock('$lib/services/contents/file/process', () => ({ prepareEntries: vi.fn() }));
vi.mock('$lib/services/utils/file', () => ({ getGitHash: vi.fn() }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * createFileList mock implementation: classifies every file as an entry.
 * Returns the canonical { entryFiles, assetFiles, configFiles, allFiles, count } shape.
 * @param {any[]} files
 */
const makeFileList = (files) => {
  const items = files.map((f) => ({ ...f, type: 'entry' }));

  return { entryFiles: items, assetFiles: [], configFiles: [], allFiles: items, count: items.length };
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('createGitBackend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    metaStoreData = {};
    fileCacheData = [];

    vi.mocked(getPathInfo).mockImplementation((path) => {
      const basename = path.split('/').pop() ?? path;

      return /** @type {any} */ ({ basename });
    });

    // Default: returns a stable but unique hash so tests can opt into cache hits explicitly.
    vi.mocked(getHash).mockResolvedValue('default_computed_hash');
    vi.mocked(getGitHash).mockResolvedValue('computed_git_sha');
    vi.mocked(prepareEntries).mockResolvedValue({ entries: [], errors: [] });
    vi.mocked(createFileList).mockImplementation(makeFileList);
  });

  // ── Backend shape ────────────────────────────────────────────────────────────

  describe('backend structure', () => {
    test('exports correct BackendService shape', () => {
      const backend = createGitBackend({
        name: 'my-backend',
        label: 'My Backend',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
      });

      expect(backend.name).toBe('my-backend');
      expect(backend.label).toBe('My Backend');
      expect(typeof backend.isGit).toBe('boolean');
      expect(typeof backend.init).toBe('function');
      expect(typeof backend.signIn).toBe('function');
      expect(typeof backend.signOut).toBe('function');
      expect(typeof backend.fetchFiles).toBe('function');
      expect(typeof backend.commitChanges).toBe('function');
    });

    test('fetchBlob is undefined when adapter does not implement it', () => {
      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
      });

      expect(backend.fetchBlob).toBeUndefined();
    });

    test('fetchBlob delegates to adapter.fetchBlob', async () => {
      const mockBlob = new Blob(['data']);
      const adapterFetchBlob = vi.fn().mockResolvedValue(mockBlob);

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
        fetchBlob: adapterFetchBlob,
      });

      const result = await backend.fetchBlob(/** @type {any} */ ({ path: 'assets/photo.jpg' }));

      expect(adapterFetchBlob).toHaveBeenCalledWith('assets/photo.jpg');
      expect(result).toBe(mockBlob);
    });

    test('commitChanges throws when adapter does not implement it', () => {
      const backend = createGitBackend({
        name: 'my-api',
        label: 'My API',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
      });

      expect(() => backend.commitChanges([], {})).toThrow(
        "commitChanges is not implemented by adapter 'my-api'",
      );
    });

    test('commitChanges delegates to adapter.commitChanges', async () => {
      const mockResult = { sha: 'abc123', files: {} };
      const adapterCommit = vi.fn().mockResolvedValue(mockResult);

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
        commitChanges: adapterCommit,
      });

      const changes = /** @type {any[]} */ ([{ action: 'create', path: 'post.md', data: '# Hi' }]);
      const options = { message: 'Create post' };
      const result = await backend.commitChanges(changes, options);

      expect(adapterCommit).toHaveBeenCalledWith(changes, options);
      expect(result).toBe(mockResult);
    });

    test('signOut resolves without error', async () => {
      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
      });

      await expect(backend.signOut()).resolves.toBeUndefined();
    });
  });

  // ── init ─────────────────────────────────────────────────────────────────────

  describe('init', () => {
    test('sets databaseName as "name:label"', () => {
      const backend = createGitBackend({
        name: 'my-backend',
        label: 'My Backend',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
      });

      backend.init();
      expect(backend.repository.databaseName).toBe('my-backend:My Backend');
    });

    test('sets service and repo to adapter name, label to adapter label', () => {
      const backend = createGitBackend({
        name: 'test-api',
        label: 'Test API',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
      });

      backend.init();
      expect(backend.repository.service).toBe('test-api');
      expect(backend.repository.repo).toBe('test-api');
      expect(backend.repository.label).toBe('Test API');
    });

    test('returns the repository object', () => {
      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn(),
        fetchBlobs: vi.fn(),
      });

      expect(backend.init()).toBe(backend.repository);
    });
  });

  // ── Cycle cache ───────────────────────────────────────────────────────────────

  describe('cycle cache — getFileList called at most once per fetchFiles()', () => {
    test('calls adapter.getFileList exactly once when getCommitHash is absent', async () => {
      const getFileList = vi.fn().mockResolvedValue([]);

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList,
        fetchBlobs: vi.fn().mockResolvedValue({}),
      });

      backend.init();
      await backend.fetchFiles();

      // fetchLastCommit calls _getOrFetchFileList (which calls getFileList once),
      // then fetchFileList reuses the cycle cache — no second call.
      expect(getFileList).toHaveBeenCalledTimes(1);
    });

    test('resets cycle cache between invocations so each fetchFiles() triggers a fresh call', async () => {
      const getFileList = vi.fn().mockResolvedValue([]);

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList,
        fetchBlobs: vi.fn().mockResolvedValue({}),
      });

      backend.init();
      await backend.fetchFiles();
      await backend.fetchFiles();

      expect(getFileList).toHaveBeenCalledTimes(2);
    });
  });

  // ── SHA-based selective fetching ─────────────────────────────────────────────

  describe('SHA-based selective fetching (no getCommitHash)', () => {
    test('only fetches changed and new files; skips files whose SHA matches the cache', async () => {
      // Existing cache: a.md (sha1) and b.md (sha2) are fully cached with metadata.
      fileCacheData = [
        ['a.md', { sha: 'sha1', text: 'old content a', meta: { cached: true } }],
        ['b.md', { sha: 'sha2', text: 'content b', meta: { cached: true } }],
      ];
      // Overall hash is stale so the file list is always re-fetched rather than served from cache.
      metaStoreData = { last_commit_hash: 'stale_hash', git_config_fetched: true };

      const fetchBlobs = vi.fn().mockResolvedValue({
        'a.md': { text: 'updated content a' },
        'c.md': { text: 'content c' },
      });

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        // a.md changed SHA, b.md unchanged, c.md is new
        getFileList: vi.fn().mockResolvedValue([
          { path: 'a.md', sha: 'sha1_changed' },
          { path: 'b.md', sha: 'sha2' },
          { path: 'c.md', sha: 'sha3_new' },
        ]),
        fetchBlobs,
      });

      backend.init();
      await backend.fetchFiles();

      expect(fetchBlobs).toHaveBeenCalledTimes(1);

      const fetchedPaths = vi.mocked(fetchBlobs).mock.calls[0][0];

      expect(fetchedPaths).toHaveLength(2);
      expect(fetchedPaths).toContain('a.md'); // SHA changed → must re-fetch
      expect(fetchedPaths).toContain('c.md'); // new file → must fetch
      expect(fetchedPaths).not.toContain('b.md'); // SHA unchanged → served from cache
    });

    test('skips fetching entirely when the overall hash is unchanged', async () => {
      // The hash getHash will compute matches the cached hash → full cache hit.
      vi.mocked(getHash).mockResolvedValue('hash_XYZ');
      metaStoreData = { last_commit_hash: 'hash_XYZ', git_config_fetched: true };
      fileCacheData = [
        ['a.md', { sha: 'sha1', text: 'content a', meta: {} }],
        ['b.md', { sha: 'sha2', text: 'content b', meta: {} }],
      ];

      const fetchBlobs = vi.fn();

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([
          { path: 'a.md', sha: 'sha1' },
          { path: 'b.md', sha: 'sha2' },
        ]),
        fetchBlobs,
      });

      backend.init();
      await backend.fetchFiles();

      // Overall cache hit → fetchBlobs never called
      expect(fetchBlobs).not.toHaveBeenCalled();
    });

    test('fetches all files on the first load when the cache is empty', async () => {
      fileCacheData = [];
      metaStoreData = {};

      const fetchBlobs = vi.fn().mockResolvedValue({
        'a.md': { text: 'content a' },
        'b.md': { text: 'content b' },
      });

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([
          { path: 'a.md', sha: 'sha1' },
          { path: 'b.md', sha: 'sha2' },
        ]),
        fetchBlobs,
      });

      backend.init();
      await backend.fetchFiles();

      expect(fetchBlobs).toHaveBeenCalledTimes(1);

      const fetchedPaths = vi.mocked(fetchBlobs).mock.calls[0][0];

      expect(fetchedPaths).toHaveLength(2);
      expect(fetchedPaths).toContain('a.md');
      expect(fetchedPaths).toContain('b.md');
    });

    test('handles a mix of cached, changed, and new files across multiple calls', async () => {
      // First call: nothing cached, all 3 files fetched.
      fileCacheData = [];
      metaStoreData = {};

      const fetchBlobs = vi.fn().mockResolvedValue({
        'a.md': { text: 'content a' },
        'b.md': { text: 'content b' },
        'c.md': { text: 'content c' },
      });

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([
          { path: 'a.md', sha: 'sha1' },
          { path: 'b.md', sha: 'sha2' },
          { path: 'c.md', sha: 'sha3' },
        ]),
        fetchBlobs,
      });

      backend.init();
      await backend.fetchFiles();
      expect(fetchBlobs).toHaveBeenCalledTimes(1);
      expect(vi.mocked(fetchBlobs).mock.calls[0][0]).toHaveLength(3);

      // Simulate second fetch: populate cache with what was written, change a.md, add d.md.
      vi.clearAllMocks();
      vi.mocked(getPathInfo).mockImplementation((path) =>
        /** @type {any} */ ({ basename: path.split('/').pop() }),
      );
      vi.mocked(getHash).mockResolvedValue('new_hash_second_fetch');
      vi.mocked(prepareEntries).mockResolvedValue({ entries: [], errors: [] });
      vi.mocked(createFileList).mockImplementation(makeFileList);

      fileCacheData = [
        ['a.md', { sha: 'sha1', text: 'content a', meta: {} }],
        ['b.md', { sha: 'sha2', text: 'content b', meta: {} }],
        ['c.md', { sha: 'sha3', text: 'content c', meta: {} }],
      ];
      metaStoreData = { last_commit_hash: 'old_hash_first_fetch', git_config_fetched: true };

      fetchBlobs.mockResolvedValue({
        'a.md': { text: 'updated content a' },
        'd.md': { text: 'content d' },
      });

      backend['fetchFiles'] = backend.fetchFiles; // reset closure reference if needed

      const backend2 = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([
          { path: 'a.md', sha: 'sha1_changed' }, // changed
          { path: 'b.md', sha: 'sha2' }, // unchanged
          { path: 'c.md', sha: 'sha3' }, // unchanged
          { path: 'd.md', sha: 'sha4' }, // new
        ]),
        fetchBlobs,
      });

      backend2.init();
      await backend2.fetchFiles();

      const secondFetchPaths = vi.mocked(fetchBlobs).mock.calls[0][0];

      expect(secondFetchPaths).toHaveLength(2);
      expect(secondFetchPaths).toContain('a.md');
      expect(secondFetchPaths).toContain('d.md');
      expect(secondFetchPaths).not.toContain('b.md');
      expect(secondFetchPaths).not.toContain('c.md');
    });
  });

  // ── SHA patching ─────────────────────────────────────────────────────────────

  describe('SHA patching', () => {
    test('computes SHA via getGitHash when adapter does not provide sha', async () => {
      fileCacheData = [];
      metaStoreData = {};

      vi.mocked(getGitHash).mockResolvedValue('content_derived_sha');

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([
          { path: 'a.md' }, // no sha
        ]),
        fetchBlobs: vi.fn().mockResolvedValue({ 'a.md': { text: 'hello world' } }),
      });

      backend.init();
      await backend.fetchFiles();

      expect(getGitHash).toHaveBeenCalledWith('hello world');
    });

    test('does not call getGitHash when adapter provides a sha for every file', async () => {
      fileCacheData = [];
      metaStoreData = {};

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([
          { path: 'a.md', sha: 'sha_provided' },
        ]),
        fetchBlobs: vi.fn().mockResolvedValue({ 'a.md': { text: 'content' } }),
      });

      backend.init();
      await backend.fetchFiles();

      expect(getGitHash).not.toHaveBeenCalled();
    });
  });

  // ── getCommitHash ─────────────────────────────────────────────────────────────

  describe('getCommitHash', () => {
    test('uses adapter.getCommitHash() instead of deriving the hash from the file list', async () => {
      const getCommitHash = vi.fn().mockResolvedValue('commit_sha_from_adapter');

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([]),
        fetchBlobs: vi.fn().mockResolvedValue({}),
        getCommitHash,
      });

      backend.init();
      await backend.fetchFiles();

      expect(getCommitHash).toHaveBeenCalledTimes(1);
      // getHash is the crypto hash used to derive a pseudo-hash from the file list.
      // It must NOT be called when the adapter provides getCommitHash directly.
      expect(getHash).not.toHaveBeenCalled();
    });

    test('skips calling getFileList during fetchLastCommit when getCommitHash is provided and cache is valid', async () => {
      const commitHash = 'adapter_commit_hash_v42';

      // Cache already has this exact hash → full cache hit, file list never fetched.
      metaStoreData = { last_commit_hash: commitHash, git_config_fetched: true };
      fileCacheData = [['a.md', { sha: 'sha1', text: 'content', meta: {} }]];

      const getFileList = vi.fn();

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList,
        fetchBlobs: vi.fn().mockResolvedValue({}),
        getCommitHash: vi.fn().mockResolvedValue(commitHash),
      });

      backend.init();
      await backend.fetchFiles();

      // Cache hit (hash matched) → fetchFileList was never called → getFileList never called.
      expect(getFileList).not.toHaveBeenCalled();
    });
  });

  // ── getDefaultBranch ──────────────────────────────────────────────────────────

  describe('getDefaultBranch', () => {
    test('uses adapter.getDefaultBranch() when provided', async () => {
      const getDefaultBranch = vi.fn().mockResolvedValue('develop');

      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([]),
        fetchBlobs: vi.fn().mockResolvedValue({}),
        getDefaultBranch,
      });

      backend.init();
      await backend.fetchFiles();

      expect(getDefaultBranch).toHaveBeenCalledTimes(1);
      expect(backend.repository.branch).toBe('develop');
    });

    test('defaults to "main" when getDefaultBranch is not provided', async () => {
      const backend = createGitBackend({
        name: 'test',
        label: 'Test',
        getFileList: vi.fn().mockResolvedValue([]),
        fetchBlobs: vi.fn().mockResolvedValue({}),
      });

      backend.init();
      await backend.fetchFiles();

      expect(backend.repository.branch).toBe('main');
    });
  });
});
