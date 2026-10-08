import { BASE_CONFIG, expect, test } from '../../fixtures/test.js';

/**
 * The fork’s built-in `table` editor component: the Insert menu of a rich text field offers Table,
 * which opens a dialog for the number of rows and columns, and the saved entry holds a Markdown
 * table.
 * @see ../../../docs/fork.md
 */

/**
 * The blog with a Markdown body, which offers the editor components.
 */
const CONFIG = {
  ...BASE_CONFIG,
  collections: [
    {
      ...BASE_CONFIG.collections[0],
      fields: [
        { name: 'title', label: 'Title' },
        { name: 'body', label: 'Body', widget: 'markdown' },
      ],
    },
  ],
};

test.describe('tables in rich text', () => {
  test.use({ config: CONFIG });

  test('inserts a table through the dialog and saves it as Markdown', async ({ cms, page }) => {
    await cms.open();
    await cms.signIn();
    await page.getByRole('button', { name: 'Create New Entry' }).first().click();

    const editor = page.getByRole('group', { name: 'Content Editor' });
    const field = editor.getByRole('group', { name: /Body.*Field/ });

    await editor.getByRole('textbox', { name: 'Title' }).fill('Prices');

    await cms.chooseMenuItem(
      field.getByRole('button', { name: 'Insert' }),
      page.getByRole('menuitem', { name: 'Table' }),
    );

    const dialog = page.locator('dialog:not([inert])');

    await expect(dialog).toBeVisible();

    // The dialog asks for the dimensions, starting at 3 × 3
    const rows = dialog.getByRole('spinbutton', { name: 'Rows' });
    const columns = dialog.getByRole('spinbutton', { name: 'Columns' });

    await expect(rows).toHaveValue('3');
    await expect(columns).toHaveValue('3');
    await rows.fill('2');
    await columns.fill('2');
    await dialog.getByRole('button', { name: 'Insert' }).click();

    // The table is in the editor, as a real table with the dimensions that were asked for
    const table = field.locator('table');

    await expect(table).toBeVisible();
    await expect(table.locator('tr')).toHaveCount(2);
    await expect(table.locator('tr').first().locator('th, td')).toHaveCount(2);

    await table.locator('th, td').nth(0).click();
    await page.keyboard.type('Item');
    await table.locator('th, td').nth(1).click();
    await page.keyboard.type('Price');
    await table.locator('th, td').nth(2).click();
    await page.keyboard.type('Coffee');
    await table.locator('th, td').nth(3).click();
    await page.keyboard.type('3');

    await editor.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Entry saved.' })).toBeVisible();

    const saved = (await cms.readRepo())['content/posts/prices.md'];

    // The body is a Markdown table
    expect(saved).toContain('| Item | Price |');
    expect(saved).toContain('| Coffee | 3 |');
  });

  test('leaves the table out when the dialog is cancelled', async ({ cms, page }) => {
    await cms.open();
    await cms.signIn();
    await page.getByRole('button', { name: 'Create New Entry' }).first().click();

    const editor = page.getByRole('group', { name: 'Content Editor' });
    const field = editor.getByRole('group', { name: /Body.*Field/ });

    await editor.getByRole('textbox', { name: 'Title' }).fill('No table');

    await cms.chooseMenuItem(
      field.getByRole('button', { name: 'Insert' }),
      page.getByRole('menuitem', { name: 'Table' }),
    );

    const dialog = page.locator('dialog:not([inert])');

    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(field.locator('table')).toHaveCount(0);

    // The placeholder paragraph the dialog left behind is gone too, so the body is still empty and
    // has to be filled in before the required field can be saved
    await field.getByRole('textbox').click();
    await page.keyboard.type('Just text.');

    await editor.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Entry saved.' })).toBeVisible();

    const saved = (await cms.readRepo())['content/posts/no-table.md'];

    expect(saved).toContain('Just text.');
    expect(saved).not.toContain('|');
  });
});
