import {
  markdown,
  MULTILINGUAL_CONFIG,
  MULTILINGUAL_FILES,
} from '../../fixtures/configs/multilingual.js';
import { expect, test } from '../../fixtures/test.js';

import { getEditPane, save, showLocale } from './helpers.js';

/**
 * @import { Page, Request } from '@playwright/test';
 * @import { CMS } from '../../fixtures/test.js';
 */

/**
 * @typedef {object} Provider
 * @property {string} label Service name in the Settings dialog.
 * @property {string} endpoint URL the CMS sends the request to.
 * @property {string} apiKey A made-up API key, in the format the CMS accepts for the service.
 * @property {(request: Request) => string | undefined} getKey Get the API key a request carries.
 * @property {(body: Record<string, any>) => { system: string, user: string }} getPrompts Get the
 * system prompt and the user message from a request body.
 * @property {(text: string) => Record<string, any>} reply Wrap the reply text the way the service
 * returns it.
 */

/* eslint-disable jsdoc/require-jsdoc -- the functions are documented with the `Provider` type */
/**
 * The AI services the CMS can translate with, each with its own API.
 * @type {Provider[]}
 */
const PROVIDERS = [
  {
    label: 'Anthropic Claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    apiKey: `sk-ant-api03-${'a'.repeat(80)}`,
    getKey: (request) => request.headers()['x-api-key'],
    getPrompts: ({ system, messages }) => ({ system, user: messages[0].content }),
    reply: (text) => ({ content: [{ type: 'text', text }] }),
  },
  {
    label: 'OpenAI GPT',
    endpoint: 'https://api.openai.com/v1/responses',
    apiKey: `sk-${'a'.repeat(48)}`,
    getKey: (request) => request.headers().authorization?.replace('Bearer ', ''),
    getPrompts: ({ instructions, input }) => ({ system: instructions, user: input }),
    reply: (text) => ({
      output: [{ type: 'message', content: [{ type: 'output_text', text }] }],
    }),
  },
  {
    label: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/*:generateContent',
    apiKey: `AIza${'a'.repeat(35)}`,
    getKey: (request) => request.headers()['x-goog-api-key'],
    getPrompts: ({ system_instruction: system, contents }) => ({
      system: system.parts[0].text,
      user: contents[0].parts[0].text,
    }),
    reply: (text) => ({ candidates: [{ content: { parts: [{ text }] } }] }),
  },
  {
    label: 'Mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    apiKey: 'a'.repeat(32),
    getKey: (request) => request.headers().authorization?.replace('Bearer ', ''),
    getPrompts: ({ messages }) => ({ system: messages[0].content, user: messages[1].content }),
    reply: (text) => ({ choices: [{ message: { role: 'assistant', content: text } }] }),
  },
  {
    label: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/chat/completions',
    apiKey: `sk-${'a'.repeat(32)}`,
    getKey: (request) => request.headers().authorization?.replace('Bearer ', ''),
    getPrompts: ({ messages }) => ({ system: messages[0].content, user: messages[1].content }),
    reply: (text) => ({ choices: [{ message: { role: 'assistant', content: text } }] }),
  },
];
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Pick the default translation service in the Settings dialog.
 * @param {CMS} cms CMS.
 * @param {Page} page Page.
 * @param {string} label Service name.
 */
const selectService = async (cms, page, label) => {
  const dialog = page.getByRole('dialog', { name: 'Settings' });

  await cms.chooseMenuItem(
    page.getByRole('button', { name: 'Show Account Menu' }),
    page.getByRole('menuitem', { name: 'Settings' }),
  );
  await dialog.getByRole('tab', { name: 'Internationalization' }).click();
  await cms.chooseMenuItem(
    dialog.getByRole('combobox', { name: 'Select Service' }),
    page.getByRole('option', { name: label }),
  );
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
};

test.use({ config: MULTILINGUAL_CONFIG });

test.beforeEach(async ({ cms }) => {
  await cms.open();
  await cms.seed(MULTILINGUAL_FILES);
  await cms.signIn();
});

// The fork offers no machine translation: the translate buttons are hidden, in the pane header
// and in the field options alike, so none of these services is ever called, whichever one is
// picked in the Settings dialog. See `docs/fork.md`; upstream translates a field with each of
// them here, and reports what the service answers
PROVIDERS.forEach(({ label, endpoint, getKey, getPrompts, reply }) => {
  test.describe(label, () => {
    /**
     * Answer the service’s requests, so a translation that did go out would be seen here.
     * @param {Page} page Page.
     * @returns {Promise<{ key?: string, system: string, texts: string[] }[]>} Requests received
     * so far.
     */
    const mockService = async (page) => {
      /** @type {{ key?: string, system: string, texts: string[] }[]} */
      const requests = [];

      await page.route(endpoint, (route) => {
        const request = route.request();
        const { system, user } = getPrompts(request.postDataJSON());
        const texts = JSON.parse(user.split('\n')[1]);
        const target = system.match(/ to (\w+)\./)?.[1] ?? '';

        requests.push({ key: getKey(request), system, texts });

        return route.fulfill({
          json: reply(
            JSON.stringify(texts.map((/** @type {string} */ text) => `${target}: ${text}`)),
          ),
        });
      });

      return requests;
    };

    test('is never called, as the fork offers no translation', async ({ cms, page }) => {
      const requests = await mockService(page);

      await selectService(cms, page, label);
      await page.getByRole('button', { name: 'Create New Entry' }).first().click();

      const english = getEditPane(page, 'English');

      await english.getByRole('textbox', { name: 'Title' }).fill('Night Markets');
      await english.getByRole('textbox', { name: 'Date' }).fill('2026-05-01');
      await english.getByRole('textbox', { name: 'Author' }).fill('Lina Saleh');
      await english.getByRole('textbox', { name: 'Summary' }).fill('Eat after dark.');
      await english.getByRole('textbox', { name: 'Body' }).click();
      await page.keyboard.type('Follow the lanterns.');

      const french = await showLocale(page, 1, 'French');
      const field = french.getByRole('group', { name: /Summary.*Field/ });

      // Neither the pane nor the field offers to translate
      await expect(french.getByRole('button', { name: 'Translate' })).toHaveCount(0);
      await cms.openPopup(
        field.getByRole('button', { name: 'Show Field Options' }),
        page.getByRole('menu', { name: 'Field Options' }),
      );
      await expect(page.getByRole('menuitem', { name: /Translate from/ })).toHaveCount(0);
      await page.keyboard.press('Escape');

      // The entry is saved with what the editor typed, and the service was never called
      await french.getByRole('textbox', { name: 'Title' }).fill('Marchés de nuit');
      await french
        .getByRole('textbox', { name: 'Summary' })
        .fill('Mangez après la tombée du jour.');
      await french.getByRole('textbox', { name: 'Body' }).click();
      await page.keyboard.type('Suivez les lanternes.');

      const arabic = await showLocale(page, 1, 'Arabic');

      await arabic.getByRole('textbox', { name: 'Title' }).fill('أسواق الليل');
      await arabic.getByRole('textbox', { name: 'Body' }).click();
      await page.keyboard.type('اتبع الفوانيس.');
      await save(page);

      expect(requests).toEqual([]);

      expect((await cms.readRepo())['content/articles/night-markets.fr.md']).toBe(
        markdown(
          {
            title: 'Marchés de nuit',
            date: '2026-05-01',
            tags: [],
            summary: 'Mangez après la tombée du jour.',
          },
          'Suivez les lanternes.',
        ),
      );
    });
  });
});
