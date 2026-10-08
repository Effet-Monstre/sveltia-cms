import { expect, test } from '../../fixtures/test.js';

/**
 * @import { Page } from '@playwright/test';
 */

/**
 * The fork’s `api` backend: the entries come from the host application rather than from Git, and
 * the user is signed in as soon as the configuration is known, with no sign-in screen.
 * @see ../../../docs/fork.md
 */

/**
 * A blog whose entries the host application serves as JSON.
 */
const CONFIG = {
  backend: { name: 'api' },
  media_folder: 'static/images',
  public_folder: '/images',
  collections: [
    {
      name: 'posts',
      label: 'Posts',
      label_singular: 'Post',
      folder: 'content/posts',
      format: 'json',
      create: true,
      fields: [
        { name: 'title', label: 'Title' },
        { name: 'body', label: 'Body', widget: 'text' },
      ],
    },
  ],
};

/**
 * The configuration the page passes to `CMS.init()`, as JSON.
 */
const CONFIG_JSON = JSON.stringify({ ...CONFIG, load_config_file: false });

/**
 * Entries the host application holds, keyed by path.
 */
const HOSTED_ENTRIES = {
  'content/posts/hello.json': { title: 'Hello', body: 'From the host application.' },
};

/**
 * Serve the admin page of a site embedding the CMS: it carries a `csrf-token` meta tag, starts the
 * CMS itself with the `api` backend, and answers the `/admin/entries` endpoints the backend reads
 * and writes through.
 * @param {Page} page Page.
 * @returns {Promise<{ written: Record<string, any>[], deleted: string[] }>} What the page has sent
 * to the host application.
 */
const serveHostApp = async (page) => {
  /** @type {Record<string, any>[]} */
  const written = [];
  /** @type {string[]} */
  const deleted = [];

  await page.route('**/admin/entries', async (route) => {
    const request = route.request();

    if (request.method() === 'GET') {
      // The CSRF token of the page is sent with every request
      expect(request.headers()['x-csrf-token']).toBe('test-token');

      await route.fulfill({
        json: {
          entries: Object.entries(HOSTED_ENTRIES).map(([handle, content]) => ({
            handle,
            content,
          })),
        },
      });

      return;
    }

    if (request.method() === 'DELETE') {
      deleted.push(JSON.parse(request.postData() ?? '{}').handle);
      await route.fulfill({ json: {} });

      return;
    }

    written.push({ body: request.postData() ?? '' });
    await route.fulfill({ json: {} });
  });

  await page.route('**/admin/', async (route) => {
    const response = await route.fetch();

    const html = (await response.text())
      .replace('<head>', '<head><meta name="csrf-token" content="test-token" />')
      .replace('<script src=', '<script>window.CMS_MANUAL_INIT = true;</script><script src=')
      .replace('</body>', `<script>CMS.init({ config: ${CONFIG_JSON} });</script></body>`);

    await route.fulfill({ response, body: html });
  });

  return { written, deleted };
};

test.describe('`api` backend and automatic sign-in', () => {
  // The admin page of the dev server starts the CMS on its own, so it can’t be given a config
  test.skip(process.env.E2E_TARGET === 'dev', 'The dev server’s admin page can’t be changed');

  test('opens straight on the collections, with no sign-in screen', async ({ cms, page }) => {
    await serveHostApp(page);
    await cms.open();

    // The collection list is there without anyone signing in
    await expect(
      page.getByRole('tree', { name: 'Collection List' }).getByRole('treeitem'),
    ).toHaveText([/Posts/]);
    expect(page.getByRole('button', { name: /Sign In/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Show Account Menu' })).toBeVisible();
  });

  test('lists the entries the host application serves, and saves back to it', async ({
    cms,
    page,
  }) => {
    const { written } = await serveHostApp(page);

    await cms.open();
    await page.getByRole('row', { name: /Hello/ }).click();

    const editor = page.getByRole('group', { name: 'Content Editor' });

    await expect(editor.getByRole('textbox', { name: 'Title' })).toHaveValue('Hello');
    await editor.getByRole('textbox', { name: 'Title' }).fill('Hello again');
    await editor.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Entry saved.' })).toBeVisible();

    // The entry was posted to the host application rather than committed to a repository
    await expect.poll(() => written.length).toBeGreaterThan(0);
    expect(written.some(({ body }) => body.includes('content/posts/hello.json'))).toBe(true);
    expect(written.some(({ body }) => body.includes('Hello again'))).toBe(true);
  });
});
