<script>
  import { _ } from 'svelte-i18n';
  import { entryDraft } from '$lib/services/contents/draft';
  import { onMount } from 'svelte';

  let { previewRenderer, locale } = $props();

  let mainRef;
  let iFrameRef;

  let out = null;

  let htmlContent = $state(null);

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

  const getCurrentValue = () => {
    const currentValue = $entryDraft?.currentValues[locale] || {};

    const obj = convertToNestedObject(currentValue);

    console.log(obj);

    return { value: obj, locale };
  };

  onMount(async () => {
    out = previewRenderer(mainRef);

    const currentValue = getCurrentValue();

    if (currentValue) {
      htmlContent = await out(currentValue);
    }
  });

  $effect(() => {
    const currentValue = getCurrentValue();

    if (currentValue && out) {
      (async () => {
        htmlContent = await out(currentValue);
      })();
    }
  });

  $effect(() => {
    //const iframeDoc = iFrameRef.contentDocument || iFrameRef.contentWindow.document;

    //console.log('hello', htmlContent);

    //iframeDoc.body.innerHtml = htmlContent;

    //iFrameRef.src = 'data:text/html,' + encodeURIComponent(htmlContent);

    iFrameRef.srcdoc = htmlContent;
  });
</script>

<div bind:this={mainRef} style="width:100%; height:100%">
  <iframe bind:this={iFrameRef} width="100%" height="100%" class="w-full h-full"> </iframe>

  {#if false && htmlContent}
    {@html htmlContent}
  {/if}
</div>
