import { BASE_CONFIG, expect, test } from '../../fixtures/test.js';

/**
 * @import { Page } from '@playwright/test';
 */

/**
 * The fork’s `CMS.registerCustomPreviewRenderer()`: a renderer registered for a collection replaces
 * the built-in preview of its entries with the HTML it builds from the entry values.
 * @see ../../../docs/fork.md
 */

/**
 * A blog with a renderer, and a second collection without one.
 */
const CONFIG = {
  ...BASE_CONFIG,
  collections: [
    {
      ...BASE_CONFIG.collections[0],
      fields: [
        { name: 'title', label: 'Title' },
        { name: 'body', label: 'Body', widget: 'text' },
      ],
    },
    {
      name: 'notes',
      label: 'Notes',
      folder: 'content/notes',
      create: true,
      fields: [{ name: 'title', label: 'Title' }],
    },
  ],
};

/**
 * Add the renderer to the admin page, the way a site using the fork does. It’s registered for the
 * `posts` collection only.
 * @param {Page} page Page.
 */
const registerRenderer = async (page) => {
  await page.route('**/admin/', async (route) => {
    const response = await route.fetch();

    const html = (await response.text()).replace(
      '</body>',
      `<script>
        CMS.registerCustomPreviewRenderer('posts', () => async ({ value, locale }) =>
          '<html><body><article data-locale="' + locale + '">' +
          '<h1 class="title">' + (value.title ?? '') + '</h1>' +
          '<p class="body">' + (value.body ?? '') + '</p>' +
          '</article></body></html>');
      </script></body>`,
    );

    await route.fulfill({ response, body: html });
  });
};

test.describe('custom preview renderers', () => {
  test.use({ config: CONFIG });

  test('shows the HTML the renderer builds, and updates it on a change', async ({ cms, page }) => {
    await registerRenderer(page);
    await cms.open();
    await cms.seed({
      'content/posts/hello.md': '---\ntitle: Hello\n---\n\nFirst draft.\n',
    });
    await cms.signIn();
    await page.getByRole('row', { name: /Hello/ }).click();

    const editor = page.getByRole('group', { name: 'Content Editor' });
    // The renderer puts its HTML in an iframe, which replaces the built-in preview. Two iframes
    // alternate so a new render only shows once it has loaded; the visible one carries `shown`
    const preview = editor.frameLocator('iframe.shown');

    await expect(preview.locator('.title')).toHaveText('Hello');
    await expect(preview.locator('.body')).toHaveText('First draft.');
    // The renderer is given the locale of the pane along with the values
    await expect(preview.locator('article')).toHaveAttribute('data-locale', '_default');
    // Nothing is left of the built-in preview, which renders a field at a time
    await expect(editor.getByRole('document', { name: 'Content Preview' })).toHaveCount(0);

    await editor.getByRole('textbox', { name: 'Title' }).fill('Hello again');
    await expect(editor.frameLocator('iframe.shown').locator('.title')).toHaveText('Hello again');

    await editor.getByRole('textbox', { name: 'Body' }).fill('Second draft.');
    await expect(editor.frameLocator('iframe.shown').locator('.body')).toHaveText('Second draft.');
  });

  test('leaves the built-in preview to a collection with no renderer', async ({ cms, page }) => {
    await registerRenderer(page);
    await cms.open();
    await cms.signIn();
    await page.getByRole('treeitem', { name: 'Notes' }).click();
    await page.getByRole('button', { name: 'Create New Entry' }).first().click();

    const editor = page.getByRole('group', { name: 'Content Editor' });

    await editor.getByRole('textbox', { name: 'Title' }).fill('A note');

    const preview = editor.getByRole('document', { name: 'Content Preview' });

    await expect(preview).toBeVisible();
    await expect(preview).toContainText('A note');
    await expect(editor.locator('iframe')).toHaveCount(0);
  });
});
