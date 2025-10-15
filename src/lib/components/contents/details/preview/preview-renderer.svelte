<script>
  import { _ } from 'svelte-i18n';
  import { entryDraft } from '$lib/services/contents/draft';
  import { onMount } from 'svelte';

  let { previewRenderer, locale } = $props();

  let mainRef;
  let iFrameRef;

  let out = null;

  let htmlContent = $state(null);

  let frames = $state([]);

  let refs = $state({});
  let idx = 0;

  let scrollY = $state(0);

  const convertToNestedObject = (flatObj) => {
    const result = {};

    for (const [key, value] of Object.entries(flatObj)) {
      // Split the key by dots to get the path
      const keys = key.split('.');
      let current = result;

      // Navigate/create the nested structure
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];

        // Check if the next key is a number (array index)
        const nextKey = keys[i + 1];
        const isNextKeyArrayIndex = /^\d+$/.test(nextKey);

        // If current key doesn't exist, create it
        if (!(currentKey in current)) {
          current[currentKey] = isNextKeyArrayIndex ? [] : {};
        }

        current = current[currentKey];
      }

      // Set the final value
      const finalKey = keys[keys.length - 1];
      current[finalKey] = value;
    }

    return result;
  };

  async function objectUrlToDataURI(objectUrl) {
    const response = await fetch(objectUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Recursively replaces any 'blob:' URLs in an object or array
   * with their equivalent Data URIs.
   */
  async function replaceBlobUrlsWithDataUris(obj) {
    if (Array.isArray(obj)) {
      // Recurse into array items
      return Promise.all(obj.map((item) => replaceBlobUrlsWithDataUris(item)));
    } else if (obj && typeof obj === 'object') {
      // Recurse into object keys
      const entries = await Promise.all(
        Object.entries(obj).map(async ([key, value]) => {
          return [key, await replaceBlobUrlsWithDataUris(value)];
        }),
      );
      return Object.fromEntries(entries);
    } else if (typeof obj === 'string' && obj.startsWith('blob:')) {
      // Found a blob URL — convert to Data URI
      try {
        return await objectUrlToDataURI(obj);
      } catch (err) {
        console.warn('Failed to convert blob URL:', obj, err);
        return obj; // fallback to original
      }
    }

    // Base case — return as-is
    return obj;
  }

  const getCurrentValue = async () => {
    const currentValue = $entryDraft?.currentValues[locale] || {};

    let obj = convertToNestedObject(currentValue);

    obj = await replaceBlobUrlsWithDataUris(obj);

    return { value: obj, locale };
  };

  onMount(async () => {
    out = previewRenderer(mainRef);

    const currentValue = await getCurrentValue();

    if (currentValue) {
      frames.push({ frameRef: undefined, id: idx++, content: await out(currentValue) });
    }
  });

  $effect(() => {
    (async () => {
      const currentValue = await getCurrentValue();

      if (currentValue && out) {
        frames.push({
          id: idx++,
          content: await out(currentValue),
          loading: false,
          loaded: false,
          hidden: false,
        });
      }
    })();
  });

  $effect(() => {
    const notLoadingIds = frames.filter((x) => !x.loading).map((x) => x.id.toString());

    for (const [key, value] of Object.entries(refs)) {
      if (notLoadingIds.indexOf(key.toString()) >= 0 && value) {
        const frame = frames.find((x) => x.id == key);

        if (!frame) {
          continue;
        }

        value.srcdoc = frame.content;

        value.addEventListener('load', () => {
          const iframeDoc = value.contentDocument || value.contentWindow.document;
          iframeDoc.documentElement.style.scrollBehavior = 'auto';

          iframeDoc.addEventListener('scroll', () => {
            scrollY = iframeDoc.documentElement.scrollTop;
          });

          const frame = frames.find((x) => x.id == key);

          if (!frame) {
            return;
          }

          for (const frame of frames) {
            if (+frame.id < +key) {
              frame.hidden = true;
            }
          }

          frame.loaded = true;

          iframeDoc.documentElement.scrollTop = +scrollY || 0;
        });

        frame.loading = true;
      }
    }
  });
</script>

<div bind:this={mainRef} style="width:100%; height:100%; position:relative;">
  {#each frames as frame (frame.id)}
    {#if !frame.hidden}
      <iframe
        bind:this={refs[frame.id]}
        width="100%"
        height="100%"
        style="width: 100%; height:100%; position:absolute; top:0;left:0; right:0; transition: opacity 0ms ease-in-out; bottom:0; opacity: {frame.loaded
          ? 1
          : 0}"
      >
      </iframe>
    {/if}
  {/each}

  {#if false && htmlContent}
    {@html htmlContent}
  {/if}
</div>
