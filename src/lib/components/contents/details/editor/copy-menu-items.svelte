<script>
  import { _ } from '@sveltia/i18n';
  import { MenuItem } from '@sveltia/ui';

  import { getEntryDraftContext } from '$lib/services/contents/draft/state.svelte';
  import { getCopyingFieldMap } from '$lib/services/contents/draft/update/copy';
  import { getLocaleLabel } from '$lib/services/contents/i18n';
  import { translator } from '$lib/services/integrations/translators';

  /**
   * @import { InternalLocaleCode, LanguagePair } from '$lib/types/private';
   * @import { FieldKeyPath } from '$lib/types/public';
   */

  /**
   * @typedef {object} Props
   * @property {InternalLocaleCode} locale Current pane’s locale.
   * @property {InternalLocaleCode[]} otherLocales Other locales.
   * @property {FieldKeyPath} [keyPath] Field key path.
   * @property {boolean} [translate] Whether to translate the field.
   * @property {boolean} [submenu] Whether to gather the source locales in a submenu when there’s
   * more than one of them. Useful where the options share a menu with unrelated commands, which a
   * long list of locales would otherwise bury.
   */

  const entryDraft = getEntryDraftContext();

  /** @type {Props} */
  let {
    /* eslint-disable prefer-const */
    locale,
    otherLocales,
    keyPath = '',
    translate = false,
    submenu = false,
    /* eslint-enable prefer-const */
  } = $props();

  const useSubmenu = $derived(submenu && otherLocales.length > 1);

  /**
   * Check if a menu item should be disabled.
   * @param {LanguagePair} languages Language pair.
   * @returns {Promise<boolean>} Whether the menu item should be disabled.
   */
  const isMenuDisabled = async ({ sourceLanguage, targetLanguage }) =>
    !entryDraft.current?.currentLocales[targetLanguage] ||
    !entryDraft.current.currentLocales[sourceLanguage] ||
    // A List or Object field’s value is stored under its child key paths, so look for anything to
    // copy within the field rather than for a value at the key path itself
    (!!keyPath &&
      !Object.keys(
        getCopyingFieldMap({
          draft: entryDraft.current,
          options: { sourceLanguage, targetLanguage, keyPath, translate },
        }),
      ).length) ||
    (translate && !(await translator.current?.availability({ sourceLanguage, targetLanguage })));

  /**
   * Copy the entry from another locale. The fork copies the values of the whole entry as they are,
   * never translating them; copying a single field does nothing, and so does any copy while either
   * locale has no values yet. See `docs/fork.md`.
   * @param {LanguagePair} languagePair Language pair.
   */
  const copy = ({ sourceLanguage }) => {
    const draft = entryDraft.current;
    const sourceValues = draft?.currentValues?.[sourceLanguage];

    if (!draft?.currentValues?.[locale] || !sourceValues || keyPath) {
      return;
    }

    draft.currentValues[locale] = structuredClone($state.snapshot(sourceValues));
  };
</script>

{#snippet localeItems()}
  {#each otherLocales as otherLocale (otherLocale)}
    {@const localeLabel = getLocaleLabel(otherLocale)}
    {@const languagePair = { sourceLanguage: otherLocale, targetLanguage: locale }}
    {#await isMenuDisabled(languagePair) then disabled}
      <MenuItem
        label={useSubmenu
          ? localeLabel
          : _(translate ? 'translate_from_x' : 'copy_from_x', { values: { locale: localeLabel } })}
        {disabled}
        onclick={() => {
          copy(languagePair);
        }}
      />
    {/await}
  {/each}
{/snippet}

{#if useSubmenu}
  <MenuItem label={_(translate ? 'translate_from' : 'copy_from')}>
    {#snippet items()}
      {@render localeItems()}
    {/snippet}
  </MenuItem>
{:else}
  {@render localeItems()}
{/if}
