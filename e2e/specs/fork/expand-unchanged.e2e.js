import { BASE_CONFIG, expect, test } from '../../fixtures/test.js';
import { getEditor, getField } from '../../fixtures/ui.js';

/**
 * Expanding an item doesn’t mark the entry changed. The fork starts every expander collapsed, so
 * the editor often renders the subfields of an item only once it’s expanded; assembling the item’s
 * value then mustn’t change the snapshot the entry is compared against.
 * @see ../../../docs/fork.md
 */

/**
 * A blog whose posts carry a required List field limited to one item, which gets its item added
 * when an entry saved without it is opened.
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
          widget: 'list',
          max: 1,
          fields: [{ name: 'name', label: 'Name' }],
        },
      ],
    },
  ],
};

test.describe('expanding an item leaves the entry unchanged', () => {
  test.use({ config: CONFIG });

  test.beforeEach(async ({ cms }) => {
    await cms.open();
  });

  test('expands the item added to a list limited to one item', async ({ cms, page }) => {
    // The post was saved before the author field was added
    await cms.seed({ 'content/posts/hello.md': '---\ntitle: Hello\n---\n\nBody.\n' });
    await cms.signIn();
    await page.getByRole('row', { name: /Hello/ }).click();

    const editor = getEditor(page);
    const author = getField(page, 'Author');
    const saveButton = editor.getByRole('button', { name: 'Save' });

    await expect(author.getByRole('button', { name: 'Expand' })).toBeVisible();
    await expect(saveButton).toBeDisabled();

    await author.getByRole('button', { name: 'Expand' }).click();
    await expect(author.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await expect(saveButton).toBeDisabled();
  });
});
