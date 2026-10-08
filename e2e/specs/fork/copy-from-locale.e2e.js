import { MULTILINGUAL_CONFIG, MULTILINGUAL_FILES } from '../../fixtures/configs/multilingual.js';
import { expect, test } from '../../fixtures/test.js';
import { getEditPane, openEntry, save, showLocale } from '../multilingual/helpers.js';

/**
 * The fork’s “Copy from” command copies the values of the whole entry as they are, without
 * translating. Copying a single field does nothing, and so does any copy while either locale has
 * no values yet.
 * @see ../../../docs/fork.md
 */

test.describe('copy from another locale', () => {
  test.use({ config: MULTILINGUAL_CONFIG });

  test.beforeEach(async ({ cms }) => {
    await cms.open();
    await cms.seed(MULTILINGUAL_FILES);
    await cms.signIn();
  });

  test('copies the values of the whole entry unchanged, and saves them', async ({ cms, page }) => {
    await openEntry(page, 'Articles', /A Weekend in Lyon/);

    const french = await showLocale(page, 1, 'French');
    const menu = page.getByRole('menu', { name: /Content Options/ });

    // With more than one other locale, the sources are grouped in a submenu
    await cms.chooseMenuItem(
      french.getByRole('button', { name: /Content Options/ }),
      menu.getByRole('menuitem', { name: 'Copy from…' }),
    );
    await page.getByRole('menuitem', { name: /^English/ }).click();

    // The English values are now in the French pane, word for word rather than translated
    await expect(french.getByRole('textbox', { name: 'Title' })).toHaveValue('A Weekend in Lyon');
    await expect(french.getByRole('textbox', { name: 'Summary' })).toHaveValue(
      'Markets and bistros.',
    );

    await save(page);

    const saved = await cms.readRepo();

    expect(saved['content/articles/lyon.fr.md']).toContain('title: A Weekend in Lyon');
    expect(saved['content/articles/lyon.fr.md']).toContain('summary: Markets and bistros.');
    // The source locale is untouched
    expect(saved['content/articles/lyon.en.md']).toContain('title: A Weekend in Lyon');
  });

  test('does nothing when a single field is copied', async ({ cms, page }) => {
    await openEntry(page, 'Articles', /A Weekend in Lyon/);
    await showLocale(page, 1, 'French');

    const french = getEditPane(page, 'French');
    const title = french.getByRole('textbox', { name: 'Title' });

    await expect(title).toHaveValue('Un week-end à Lyon');

    // The field options offer no copy at all in the fork, so there is no way to copy one field
    const menu = page.getByRole('menu', { name: 'Field Options' });

    await cms.openPopup(french.getByRole('button', { name: 'Show Field Options' }).first(), menu);
    await expect(menu.getByRole('menuitem', { name: /Copy from/ })).toHaveCount(0);
    await page.keyboard.press('Escape');

    await expect(title).toHaveValue('Un week-end à Lyon');
  });

  test('does nothing while the other locale has no values yet', async ({ cms, page }) => {
    // A new guide starts in English only, so the other locales have no values at all
    await page.getByRole('treeitem', { name: 'Guides' }).click();
    await page.getByRole('button', { name: 'Create New Entry' }).first().click();

    const english = getEditPane(page, 'English');

    await english.getByRole('textbox', { name: 'Title' }).fill('Fez Medina');

    const menu = page.getByRole('menu', { name: /Content Options/ });

    await cms.chooseMenuItem(
      english.getByRole('button', { name: /Content Options/ }),
      menu.getByRole('menuitem', { name: 'Copy from…' }),
    );

    // Copying from a locale that has no content is refused, so nothing is copied
    await expect(page.getByRole('menuitem', { name: /^French/ })).toBeDisabled();
    await expect(page.getByRole('menuitem', { name: /^Arabic/ })).toBeDisabled();
    await expect(english.getByRole('textbox', { name: 'Title' })).toHaveValue('Fez Medina');
  });
});
