/**
 * Register a custom rich text editor component, which can be used in RichText and Markdown fields.
 * Registering a component with the same `id` again replaces the previous one. A component with the
 * `type` option set to `inline` is a pattern-based inline component, compatible with Decap CMS,
 * which has no fields.
 * @param {CustomEditorComponentDefinition} definition Component definition.
 * @throws {TypeError} If `definition` is not an object, `id` is not a non-empty string, `label` is
 * given but not a non-empty string, `pattern` is not a regular expression, `toPreview` is given
 * but not a function, or the other options are invalid. A field-based component must have
 * `toBlock` as a function and `fields` as an array, and the HTML options must be valid:
 * `htmlSelector`, `fromBlockHTML` and `toBlockHTML` must be given together, and `htmlSelector`
 * must be a valid CSS selector naming the element types it matches. An inline component must have
 * `toInline` as a function, `fromInline`, `onInsert` and `onEdit` must be functions if given, and
 * `trigger` must be a non-empty string if given.
 * @see https://decapcms.org/docs/custom-widgets/#registereditorcomponent
 * @see https://sveltiacms.app/en/docs/api/editor-components
 */
export function registerEditorComponent(definition: CustomEditorComponentDefinition): void;
import type { CustomEditorComponentDefinition } from '../../../types/public';
