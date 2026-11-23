/**
 * @import { CustomPreviewRenderer } from '../../../types/private';
 */
/**
 * Register a custom entry preview renderer, which replaces the built-in preview pane of the given
 * collection. This is an Effet Monstre fork addition; see `docs/fork.md`. Registering a renderer
 * with the same name again replaces the previous one.
 * @param {string} name Name of the entry collection whose entries are previewed with the renderer.
 * @param {CustomPreviewRenderer} renderer Factory that receives the container element and returns a
 * function turning the entry values into an HTML string.
 * @throws {TypeError} If `name` is not a non-empty string or `renderer` is not a function.
 */
export function registerCustomPreviewRenderer(name: string, renderer: CustomPreviewRenderer): void;
import type { CustomPreviewRenderer } from '../../../types/private';
