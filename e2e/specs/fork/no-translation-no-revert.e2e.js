import { MULTILINGUAL_CONFIG, MULTILINGUAL_FILES } from '../../fixtures/configs/multilingual.js';
import { expect, test } from '../../fixtures/test.js';
import { getEditor, openEntry, showLocale } from '../multilingual/helpers.js';

/**
 * The fork offers no machine translation and no way to revert: the translate buttons and every
 * “Revert Changes” command are gone, from the pane header, the editor toolbar and the field
 * options. Upstream’s Restore Default and Clear commands, which share those menus, are kept.
 * @see ../../../docs/fork.md
 */

test.describe('no machine translation and no revert', () => {
  test.use({ config: MULTILINGUAL_CONFIG });

  test.beforeEach(async ({ cms }) => {
    await cms.open();
    await cms.seed(MULTILINGUAL_FILES);
    await cms.signIn();
    await openEntry(cms.page, 'Articles', /A Weekend in Lyon/);
  });

  test('offers no translate button in the pane header', async ({ page }) => {
    await showLocale(page, 1, 'French');

    await expect(getEditor(page).getByRole('button', { name: /Translate/ })).toHaveCount(0);
  });

  test('offers no Revert command in the content options of a pane', async ({ cms, page }) => {
    const pane = await showLocale(page, 1, 'French');
    const menu = page.getByRole('menu', { name: /Content Options/ });

    await cms.openPopup(pane.getByRole('button', { name: /Content Options/ }), menu);

    await expect(menu.getByRole('menuitem', { name: /Revert/ })).toHaveCount(0);
    // The commands the fork keeps are still there
    await expect(menu.getByRole('menuitem', { name: 'Restore Default' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Clear All' })).toBeVisible();
  });

  test('offers no Revert command in the editor options', async ({ cms, page }) => {
    const menu = page.getByRole('menu', { name: 'Editor Options' });

    await cms.openPopup(getEditor(page).getByRole('button', { name: 'Show Editor Options' }), menu);

    await expect(menu.getByRole('menuitem', { name: /Revert/ })).toHaveCount(0);
    await expect(menu.getByRole('menuitem', { name: 'Restore Default' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Clear All' })).toBeVisible();
  });

  test('offers no Revert command and no copy in the field options', async ({ cms, page }) => {
    await showLocale(page, 1, 'French');

    const menu = page.getByRole('menu', { name: 'Field Options' });

    await cms.openPopup(
      getEditor(page).getByRole('button', { name: 'Show Field Options' }).first(),
      menu,
    );

    await expect(menu.getByRole('menuitem', { name: /Revert/ })).toHaveCount(0);
    await expect(menu.getByRole('menuitem', { name: /Copy from/ })).toHaveCount(0);
    await expect(menu.getByRole('menuitem', { name: 'Clear' })).toBeVisible();
  });

  test('has no Revert command anywhere in the editor of a multilingual entry', async ({ page }) => {
    await showLocale(page, 1, 'French');

    const editor = getEditor(page);

    // Open every menu the editor offers, one at a time, and look through all of them
    const buttons = await editor
      .getByRole('button', { name: /Show Editor Options|Content Options|Show Field Options/ })
      .all();

    expect(buttons.length).toBeGreaterThan(0);
    await expect(editor.getByRole('button', { name: /Translate/ })).toHaveCount(0);

    await buttons.reduce(async (previous, button) => {
      await previous;
      await button.click();
      await expect(page.locator('dialog.popup:not([inert])').first()).toBeVisible();
      await expect(page.getByRole('menuitem', { name: /Revert/ })).toHaveCount(0);
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog.popup:not([inert])')).toHaveCount(0);
    }, Promise.resolve());
  });
});
