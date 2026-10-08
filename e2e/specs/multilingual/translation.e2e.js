import { fileURLToPath } from 'node:url';

import {
  markdown,
  MULTILINGUAL_CONFIG,
  MULTILINGUAL_FILES,
} from '../../fixtures/configs/multilingual.js';
import { expect, test } from '../../fixtures/test.js';

import { getEditPane, save, showLocale } from './helpers.js';

/**
 * @import { Page } from '@playwright/test';
 */

test.use({ config: MULTILINGUAL_CONFIG });

/**
 * Answer the Google Cloud Translation API requests with a fake translation, which tags each text
 * with the target language, e.g. `AR: `, and keep the requests to check them.
 * @param {Page} page Page.
 * @returns {Promise<{ q: string[], source: string, target: string, apiKey: string | null }[]>}
 * Requests received so far.
 */
const mockTranslator = async (page) => {
  /** @type {{ q: string[], source: string, target: string, apiKey: string | null }[]} */
  const requests = [];

  // The CMS loads Turndown from a CDN to convert the translated HTML back to Markdown; serve the
  // installed copy instead, so the tests don’t depend on the network
  await page.route('https://unpkg.com/turndown@*/lib/turndown.browser.es.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      path: fileURLToPath(import.meta.resolve('turndown/lib/turndown.browser.es.js')),
    }),
  );
  await page.route('https://translation.googleapis.com/**', (route) => {
    const request = route.request();
    const { q, source, target } = request.postDataJSON();

    requests.push({ q, source, target, apiKey: request.headers()['x-goog-api-key'] ?? null });

    return route.fulfill({
      json: {
        data: {
          translations: q.map((/** @type {string} */ text) => ({
            // Tag the text within the HTML the CMS sends for a Markdown field
            translatedText: text.replace(/^(<p[^>]*>)?/, `$1${target.toUpperCase()}: `),
          })),
        },
      },
    });
  });

  return requests;
};

test.beforeEach(async ({ cms, page }) => {
  await cms.open();
  await cms.seed(MULTILINGUAL_FILES);
  await cms.signIn();
  await page.getByRole('button', { name: 'Create New Entry' }).first().click();

  const english = getEditPane(page, 'English');

  await english.getByRole('textbox', { name: 'Title' }).fill('Night Markets');
  await english.getByRole('textbox', { name: 'Date' }).fill('2026-05-01');
  await english.getByRole('textbox', { name: 'Author' }).fill('Lina Saleh');
  await english.getByRole('textbox', { name: 'Item Value' }).fill('food');
  await english.getByRole('textbox', { name: 'Summary' }).fill('Eat after dark.');
  await english.getByRole('textbox', { name: 'Body' }).click();
  await page.keyboard.type('Follow the **lanterns**.');
});

// The fork copies the values of the whole entry as they are, rather than the translatable fields
// one by one, and shows no toast; see `docs/fork.md`
test('copies the fields from another locale', async ({ cms, page }) => {
  const french = await showLocale(page, 1, 'French');

  // The locales to copy from are gathered in a submenu of the pane’s options
  await cms.chooseMenuItem(
    french.getByRole('button', { name: /Show.*French.*Content Options/ }),
    page.getByRole('menuitem', { name: 'Copy from…' }),
  );
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(french.getByRole('textbox', { name: 'Title' })).toHaveValue('Night Markets');
  await expect(french.getByRole('textbox', { name: 'Body' })).toHaveText('Follow the lanterns.');

  const arabic = await showLocale(page, 1, 'Arabic');

  await arabic.getByRole('textbox', { name: 'Title' }).fill('أسواق الليل');
  await arabic.getByRole('textbox', { name: 'Body' }).click();
  await page.keyboard.type('اتبع الفوانيس.');
  await save(page);

  // Every value of the source locale is copied as it is, the field that isn’t localized included
  expect((await cms.readRepo())['content/articles/night-markets.fr.md']).toBe(
    markdown(
      {
        title: 'Night Markets',
        date: '2026-05-01',
        author: 'Lina Saleh',
        tags: ['food'],
        summary: 'Eat after dark.',
      },
      'Follow the **lanterns**.',
    ),
  );
});

// The fork offers no machine translation: the translate buttons are hidden, in the pane header
// and in the field options alike, so no translation service is ever called; see `docs/fork.md`
test('offers no way to translate one field', async ({ cms, page }) => {
  const requests = await mockTranslator(page);
  const french = await showLocale(page, 1, 'French');
  const field = french.getByRole('group', { name: /Body.*Field/ });

  await expect(field.getByRole('button', { name: 'Translate' })).toHaveCount(0);
  await cms.openPopup(
    field.getByRole('button', { name: 'Show Field Options' }),
    page.getByRole('menu', { name: 'Field Options' }),
  );
  await expect(page.getByRole('menuitem', { name: /Translate from/ })).toHaveCount(0);
  await page.keyboard.press('Escape');
  expect(requests).toEqual([]);
});

test('offers no way to translate a whole locale', async ({ cms, page }) => {
  const requests = await mockTranslator(page);
  const arabic = await showLocale(page, 1, 'Arabic');

  await expect(arabic.getByRole('button', { name: 'Translate' })).toHaveCount(0);
  await cms.openPopup(
    arabic.getByRole('button', { name: /Content Options/ }),
    page.getByRole('menu', { name: /Content Options/ }),
  );
  await expect(page.getByRole('menuitem', { name: /Translate from/ })).toHaveCount(0);
  await page.keyboard.press('Escape');

  // The fields are left as they were, and no service was called
  await expect(arabic.getByRole('textbox', { name: 'Summary' })).toHaveValue('');
  expect(requests).toEqual([]);
});
