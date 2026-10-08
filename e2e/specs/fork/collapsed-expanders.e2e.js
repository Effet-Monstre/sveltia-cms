import { BASE_CONFIG, expect, test } from '../../fixtures/test.js';

/**
 * The fork collapses the expanders by default: an Object field without a `collapsed` option, and
 * the items of a List field, start closed rather than open.
 * @see ../../../docs/fork.md
 */

/**
 * A blog whose posts carry an Object field without a `collapsed` option, one that asks to start
 * expanded, and a List field with subfields.
 */
const CONFIG = {
  ...BASE_CONFIG,
  collections: [
    {
      ...BASE_CONFIG.collections[0],
      fields: [
        { name: 'title', label: 'Title' },
        {
          name: 'author',
          label: 'Author',
          widget: 'object',
          fields: [
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email', required: false },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          widget: 'object',
          collapsed: false,
          fields: [{ name: 'description', label: 'Description', required: false }],
        },
        {
          name: 'links',
          label: 'Links',
          widget: 'list',
          required: false,
          fields: [{ name: 'url', label: 'URL' }],
        },
      ],
    },
  ],
};

const ENTRY =
  '---\ntitle: Hello\nauthor:\n  name: Melvin\n  email: melvin@example.com\n' +
  'seo:\n  description: A post\nlinks:\n  - url: https://example.com\n---\n\nBody.\n';

test.describe('expanders start collapsed', () => {
  test.use({ config: CONFIG });

  test.beforeEach(async ({ cms, page }) => {
    await cms.open();
    await cms.seed({ 'content/posts/hello.md': ENTRY });
    await cms.signIn();
    await page.getByRole('row', { name: /Hello/ }).click();
  });

  test('starts an object field without a `collapsed` option closed', async ({ page }) => {
    const editor = page.getByRole('group', { name: 'Content Editor' });
    const author = editor.getByRole('group', { name: /“.Author.” Field/ });

    // Closed: it offers to expand, and its subfields aren’t rendered
    await expect(author.getByRole('button', { name: 'Expand' })).toBeVisible();
    await expect(author.getByRole('textbox', { name: 'Name' })).toHaveCount(0);

    await author.getByRole('button', { name: 'Expand' }).click();

    await expect(author.getByRole('textbox', { name: 'Name' })).toHaveValue('Melvin');
    await expect(author.getByRole('button', { name: 'Collapse' })).toBeVisible();
  });

  test('honours `collapsed: false`, which asks for an expanded object', async ({ page }) => {
    const editor = page.getByRole('group', { name: 'Content Editor' });
    const seo = editor.getByRole('group', { name: /“.SEO.” Field/ });

    await expect(seo.getByRole('textbox', { name: 'Description' })).toHaveValue('A post');
    await expect(seo.getByRole('button', { name: 'Collapse' })).toBeVisible();
  });

  test('starts the items of a list field closed', async ({ page }) => {
    const editor = page.getByRole('group', { name: 'Content Editor' });
    const links = editor.getByRole('group', { name: /“.Links.” Field/ });

    // The list itself is open, so the items are listed, but each item is closed
    await expect(links.getByRole('textbox', { name: 'URL' })).toHaveCount(0);
    await expect(links.getByRole('button', { name: 'Expand' })).toHaveCount(1);

    await links.getByRole('button', { name: 'Expand' }).click();
    await expect(links.getByRole('textbox', { name: 'URL' })).toHaveValue('https://example.com');
  });
});
