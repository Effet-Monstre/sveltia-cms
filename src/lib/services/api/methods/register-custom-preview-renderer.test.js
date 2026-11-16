import { describe, expect, test } from 'vitest';

import { registerCustomPreviewRenderer } from '$lib/services/api/methods/register-custom-preview-renderer';
import { customPreviewRenderers } from '$lib/services/api/registries';

describe('CMS.registerCustomPreviewRenderer()', () => {
  test('registers a renderer for a collection, replacing the previous one', () => {
    const renderer = () => async () => '<p>Hello</p>';
    const otherRenderer = () => async () => '<p>Bonjour</p>';

    registerCustomPreviewRenderer('posts', renderer);
    expect(customPreviewRenderers.posts).toBe(renderer);

    registerCustomPreviewRenderer('posts', otherRenderer);
    expect(customPreviewRenderers.posts).toBe(otherRenderer);
  });

  test('throws TypeError when name is not a non-empty string', () => {
    const renderer = () => async () => '';

    // @ts-ignore
    expect(() => registerCustomPreviewRenderer(123, renderer)).toThrow(TypeError);
    expect(() => registerCustomPreviewRenderer('   ', renderer)).toThrow(
      'The `name` option for `CMS.registerCustomPreviewRenderer()` must be a non-empty string',
    );
  });

  test('throws TypeError when renderer is not a function', () => {
    // @ts-ignore
    expect(() => registerCustomPreviewRenderer('posts', '<p>Hello</p>')).toThrow(
      'The `renderer` option for `CMS.registerCustomPreviewRenderer()` must be a function',
    );
  });
});
