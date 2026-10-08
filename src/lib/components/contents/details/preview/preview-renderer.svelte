<!--
  @component
  Render the entry preview with a renderer registered through `CMS.registerCustomPreviewRenderer()`
  instead of the built-in preview. The renderer is a factory that returns a function turning the
  entry values into an HTML string, which is shown in an iframe. This is an Effet Monstre fork
  addition; see `docs/fork.md`.
-->
<script>
  import { onMount } from 'svelte';

  import { getEntryDraftContext } from '$lib/services/contents/draft/state.svelte';
  import { getValueMapSnapshot } from '$lib/services/contents/draft/value-map.svelte';

  /**
   * @import {
   * CustomPreviewRenderer,
   * CustomPreviewRenderFunction,
   * InternalLocaleCode,
   * } from '$lib/types/private';
   */

  /**
   * @typedef {object} Props
   * @property {CustomPreviewRenderer} previewRenderer Renderer registered for the collection.
   * @property {InternalLocaleCode} locale Current pane’s locale.
   */

  const entryDraft = getEntryDraftContext();

  /** @type {Props} */
  let {
    /* eslint-disable prefer-const */
    previewRenderer,
    locale,
    /* eslint-enable prefer-const */
  } = $props();

  /**
   * Element the renderer is given, so it can set itself up against the preview pane.
   * @type {HTMLElement | undefined}
   */
  let wrapper = $state();
  /**
   * The two iframes the renders alternate between: the result is loaded into the hidden one and
   * only shown once it’s ready, so the preview doesn’t flash while the user types.
   * @type {(HTMLIFrameElement | undefined)[]}
   */
  const frames = $state([undefined, undefined]);
  /** Index of the iframe the user is looking at, or `-1` before the first render. */
  let shownIndex = $state(-1);
  /** @type {CustomPreviewRenderFunction | undefined} */
  let render;
  /** Scroll position of the preview, kept across renders. */
  let scrollTop = 0;
  /** Whether a render is in flight. */
  let rendering = false;
  /** Whether the values changed while a render was in flight. */
  let stale = false;

  const valueMap = $derived(getValueMapSnapshot(entryDraft.current, locale));

  /**
   * Turn a map of dot-notated key paths into the nested object a renderer expects, with a numeric
   * key making an array, as in the entry file the CMS writes.
   * @param {Record<string, any>} flattened Flattened entry values.
   * @returns {Record<string, any>} Nested values.
   */
  const unflattenValues = (flattened) => {
    /** @type {Record<string, any>} */
    const result = {};

    Object.entries(flattened).forEach(([keyPath, value]) => {
      const keys = keyPath.split('.');
      let current = result;

      keys.slice(0, -1).forEach((key, index) => {
        if (!(key in current)) {
          current[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};
        }

        current = current[key];
      });

      current[keys[keys.length - 1]] = value;
    });

    return result;
  };

  /**
   * Read an object URL as a data URI, so an image the user has just uploaded is shown in the
   * preview iframe, which has an origin of its own and can’t read a blob URL of this page.
   * @param {string} objectURL Object URL.
   * @returns {Promise<string>} Data URI.
   */
  const objectURLToDataURI = async (objectURL) => {
    const blob = await (await fetch(objectURL)).blob();

    // eslint-disable-next-line jsdoc/require-jsdoc
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(/** @type {string} */ (reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  /**
   * Replace every object URL within the given value, however deeply nested, with a data URI.
   * @param {any} value Value to walk.
   * @returns {Promise<any>} Value with every object URL replaced.
   */
  const replaceObjectURLs = async (value) => {
    if (Array.isArray(value)) {
      return Promise.all(value.map(replaceObjectURLs));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        await Promise.all(
          Object.entries(value).map(async ([key, item]) => [key, await replaceObjectURLs(item)]),
        ),
      );
    }

    if (typeof value === 'string' && value.startsWith('blob:')) {
      try {
        return await objectURLToDataURI(value);
      } catch (ex) {
        // eslint-disable-next-line no-console
        console.warn('Failed to convert blob URL:', value, ex);

        return value;
      }
    }

    return value;
  };

  /**
   * Show the given HTML in the hidden iframe, and show that iframe once it has loaded, keeping the
   * scroll position so the preview doesn’t jump while the user types.
   * @param {string} html HTML returned by the renderer.
   * @returns {Promise<void>} Promise resolved once the iframe has loaded.
   */
  const showHTML = (html) =>
    new Promise((resolve) => {
      const index = shownIndex === 0 ? 1 : 0;
      const frame = frames[index];

      /* v8 ignore next 5 -- the iframes are bound as soon as the component is mounted */
      if (!frame) {
        resolve();

        return;
      }

      frame.addEventListener(
        'load',
        () => {
          const doc = frame.contentDocument;

          if (doc) {
            doc.documentElement.style.scrollBehavior = 'auto';
            doc.documentElement.scrollTop = scrollTop;
            doc.addEventListener('scroll', () => {
              scrollTop = doc.documentElement.scrollTop;
            });
          }

          shownIndex = index;
          resolve();
        },
        { once: true },
      );

      frame.srcdoc = html;
    });

  /**
   * Render the current values and show the result, one render at a time. A change made while a
   * render is in flight is picked up as soon as it finishes, so the preview ends up showing the
   * latest values without queueing up a render per keystroke.
   */
  const renderPreview = async () => {
    if (!render || rendering) {
      stale = !!render;

      return;
    }

    rendering = true;

    try {
      do {
        stale = false;

        // eslint-disable-next-line no-await-in-loop
        const value = await replaceObjectURLs(unflattenValues(valueMap));
        // eslint-disable-next-line no-await-in-loop
        const html = await render({ value, locale });

        // eslint-disable-next-line no-await-in-loop
        await showHTML(html ?? '');
      } while (stale);
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(ex);
    } finally {
      rendering = false;
    }
  };

  onMount(() => {
    render = previewRenderer(wrapper);
  });

  $effect(() => {
    // Read the values so the preview is rendered again whenever they change
    void valueMap;
    renderPreview();
  });
</script>

<div bind:this={wrapper} role="document" class="wrapper">
  {#each [0, 1] as index (index)}
    <iframe bind:this={frames[index]} title="" class="frame" class:shown={shownIndex === index}
    ></iframe>
  {/each}
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    opacity: 0;
    pointer-events: none;
  }

  .frame.shown {
    opacity: 1;
    pointer-events: auto;
  }
</style>
