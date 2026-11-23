import { customPreviewRenderers } from '$lib/services/api/registries';
import { assertOption } from '$lib/services/api/validate';
import { isNonEmptyString } from '$lib/services/utils/string';

/**
 * @import { CustomPreviewRenderer } from '../../../types/private';
 */
// Don’t use `$lib` in `from` above, or type declarations will not be exported

/**
 * Register a custom entry preview renderer, which replaces the built-in preview pane of the given
 * collection. This is an Effet Monstre fork addition; see `docs/fork.md`. Registering a renderer
 * with the same name again replaces the previous one.
 * @param {string} name Name of the entry collection whose entries are previewed with the renderer.
 * @param {CustomPreviewRenderer} renderer Factory that receives the container element and returns a
 * function turning the entry values into an HTML string.
 * @throws {TypeError} If `name` is not a non-empty string or `renderer` is not a function.
 */
const registerCustomPreviewRenderer = (name, renderer) => {
  assertOption(
    isNonEmptyString(name),
    'registerCustomPreviewRenderer',
    'name',
    'a non-empty string',
  );
  assertOption(
    typeof renderer === 'function',
    'registerCustomPreviewRenderer',
    'renderer',
    'a function',
  );

  customPreviewRenderers[name] = renderer;
};

// Export the function this way instead of `export const` to prevent the annotations from being
// stripped in the generated `register-custom-preview-renderer.d.ts` file
export { registerCustomPreviewRenderer };
