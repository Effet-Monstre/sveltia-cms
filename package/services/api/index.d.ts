export default CMS;
declare namespace CMS {
    export { React };
    export { getFieldType };
    export { getFieldType as getWidget };
    export { init };
    export { registerCustomFormat };
    export { registerCustomPreviewRenderer };
    export { registerEditorComponent };
    export { registerEventListener };
    export { registerFieldType };
    export { registerPreviewStyle };
    export { registerPreviewTemplate };
    export { registerFieldType as registerWidget };
    export { renderRichText };
}
/**
 * Get the definition of a field type (widget), so that a custom field type can reuse the control
 * and/or preview component of another field type. The components are React components; for a
 * built-in field type, they render the built-in Svelte components internally. Only the built-in
 * field types that work outside the entry editor can be reused: `boolean`, `color`, `datetime`,
 * `map`, `number`, `select`, `string`, `text` and `uuid`. `CMS.getWidget()` is an alias of this
 * method for compatibility with Netlify/Decap CMS.
 * @param {string} name Field type name.
 * @returns {FieldTypeDefinition | undefined} Field type definition, or `undefined` if the field
 * type is not registered or cannot be reused.
 * @throws {TypeError} If `name` is not a non-empty string.
 * @see https://sveltiacms.app/en/docs/api/field-types
 */
export function getFieldType(name: string): FieldTypeDefinition | undefined;
/**
 * Initialize the CMS, optionally with the given CMS configuration. When the CMS is loaded with a
 * classic `<script>` tag, e.g. from a CDN, it initializes itself automatically unless
 * `window.CMS_MANUAL_INIT` is set to `true` before the script is loaded. When it’s imported as a
 * module, e.g. from the npm package, this method always has to be called. It mounts the app on the
 * `<div id="nc-root">` element if present, or the `<body>` element otherwise, waiting for the page
 * content to be loaded if needed. Calls after the first one are ignored.
 * @param {object} [options] Options.
 * @param {CmsConfig} [options.config] Configuration to be merged with the configuration file, such
 * as `config.yml`. Its options override the file’s, except for arrays such as `collections`, which
 * are concatenated, so an array item can be added but not replaced. Include
 * `load_config_file: false` to prevent the configuration file from being loaded, in which case
 * this has to be a complete configuration.
 * @returns {Promise<void>} Promise that resolves once the app has been mounted.
 * @throws {TypeError} If `config` is neither an object nor `undefined`. As this is an async
 * function, the error is thrown as a rejection of the returned Promise.
 * @see https://decapcms.org/docs/manual-initialization/
 * @see https://sveltiacms.app/en/docs/api/initialization
 */
export function init({ config }?: {
    config?: CmsConfig | undefined;
}): Promise<void>;
/**
 * @import {
 * AppEventListener,
 * CmsConfig,
 * CustomFieldControl,
 * CustomFieldPreview,
 * CustomFieldSchema,
 * CustomPreviewTemplate,
 * EditorComponentDefinition,
 * FieldTypeDefinition,
 * FileFormatter,
 * FileParser,
 * } from '../../types/public';
 * @import { CustomPreviewRenderer } from '../../types/private';
 */
/**
 * The React instance bundled with the CMS, which renders custom preview templates, custom field
 * types and editor component previews. Hooks such as `useState` only work when taken from this
 * instance, not from another copy of React, e.g. the `react` package installed by the user.
 * @type {typeof import('react')}
 * @see https://sveltiacms.app/en/docs/api#writing-react-components
 */
export const React: typeof import("react");
/**
 * Register a custom entry file format. A custom format with the same name as a built-in one, such
 * as `json`, takes precedence over it, and registering a format again replaces the previous one.
 * @param {string} name Format name. This should match the `format` option of a collection where the
 * custom format will be used.
 * @param {string} extension File extension without a leading dot, e.g. `json5`. Files in a
 * collection with the custom format use this extension, regardless of the collection’s `extension`
 * option.
 * @param {{ fromFile?: FileParser, toFile?: FileFormatter }} methods Parser and/or formatter
 * methods. Async functions can be used. Without `fromFile`, files in the format are parsed with the
 * built-in parser for the format name, if any; without `toFile`, they are formatted likewise. If
 * the format name isn’t a built-in one, such as `yaml` or `json`, omit neither: without `fromFile`,
 * files in the format can’t be loaded, and without `toFile`, saving an entry fails with an error,
 * leaving the file untouched. A warning is logged when either is missing.
 * @throws {TypeError} If `name` or `extension` is not a non-empty string, or if `fromFile` or
 * `toFile` is given but not a function.
 * @throws {Error} If neither `fromFile` nor `toFile` is provided.
 * @see https://decapcms.org/docs/custom-formatters/
 * @see https://sveltiacms.app/en/docs/api/file-formats
 */
export function registerCustomFormat(name: string, extension: string, { fromFile, toFile }?: {
    fromFile?: FileParser;
    toFile?: FileFormatter;
}): void;
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
/**
 * Register a custom rich text editor component, which can be used in RichText and Markdown fields.
 * Registering a component with the same `id` again replaces the previous one.
 * @param {EditorComponentDefinition} definition Component definition.
 * @throws {TypeError} If `definition` is not an object, `id` is not a non-empty string, `label` is
 * given but not a non-empty string, `pattern` is not a regular expression, `toBlock` is not a
 * function, `toPreview` is given but not a function, `fields` is not an array, or the HTML options
 * are invalid: `htmlSelector`, `fromBlockHTML` and `toBlockHTML` must be given together, and
 * `htmlSelector` must be a valid CSS selector naming the element types it matches.
 * @see https://decapcms.org/docs/custom-widgets/#registereditorcomponent
 * @see https://sveltiacms.app/en/docs/api/editor-components
 */
export function registerEditorComponent(definition: EditorComponentDefinition): void;
/**
 * Register an event listener. Multiple listeners can be registered for the same event; they are
 * called in the order of registration.
 * @param {AppEventListener} eventListener Event listener.
 * @throws {TypeError} If the event listener is not an object, `name` is not a string, or `handler`
 * is not a function.
 * @throws {RangeError} If the event listener name is not a supported event type.
 * @see https://decapcms.org/docs/registering-events/
 * @see https://sveltiacms.app/en/docs/api/events
 */
export function registerEventListener(eventListener: AppEventListener): void;
/**
 * Register a custom field type (widget), which can be used with the `widget` field option.
 * Registering a field type with the same name again replaces the previous one.
 * `CMS.registerWidget()` is an alias of this method for compatibility with Netlify/Decap CMS.
 * @param {string} name Field type name, which cannot be the name of a built-in field type.
 * @param {CustomFieldControl | string} control React component for the edit pane, or the name of
 * another custom field type whose control is reused.
 * @param {CustomFieldPreview} [preview] React component for the preview pane. If omitted, no
 * preview is rendered for the field.
 * @param {CustomFieldSchema} [schema] JSON schema to validate the field type’s options in the CMS
 * configuration.
 * @throws {TypeError} If `name` is not a non-empty string, `control` is neither a React component
 * nor a string, `preview` is given but not a React component, or `schema` is given but not an
 * object.
 * @throws {Error} If `name` is the name of a built-in field type.
 * @see https://decapcms.org/docs/custom-widgets/
 * @see https://sveltiacms.app/en/docs/api/field-types
 */
export function registerFieldType(name: string, control: CustomFieldControl | string, preview?: CustomFieldPreview, schema?: CustomFieldSchema): void;
/**
 * Register a custom stylesheet to be applied to the entry preview pane. Multiple stylesheets can
 * be registered.
 * @param {string} style URL or file path of a stylesheet, or a raw CSS string if the `raw` option
 * is `true`. A relative path is resolved against the current page URL.
 * @param {object} [options] Options.
 * @param {boolean} [options.raw] Whether `style` is a raw CSS string. Default: `false`.
 * @throws {TypeError} If `style` is not a non-empty string, `raw` is not a boolean, or `style` is
 * not a valid URL or file path when `raw` is `false`.
 * @see https://decapcms.org/docs/customization/#registerpreviewstyle
 * @see https://sveltiacms.app/en/docs/api/preview-styles
 */
export function registerPreviewStyle(style: string, { raw }?: {
    raw?: boolean | undefined;
}): void;
/**
 * Register a custom preview template, which replaces the default entry preview. Registering a
 * template with the same name again replaces the previous one.
 * @param {string} name Name of the entry collection, or of the file in a file/singleton collection,
 * whose entries are previewed with the template.
 * @param {CustomPreviewTemplate} component React component.
 * @throws {TypeError} If `name` is not a non-empty string or `component` is not a React component.
 * @see https://decapcms.org/docs/customization/#registerpreviewtemplate
 * @see https://sveltiacms.app/en/docs/api/preview-templates
 */
export function registerPreviewTemplate(name: string, component: CustomPreviewTemplate): void;
import { renderRichText } from './rich-text';
import type { FieldTypeDefinition } from '../../types/public';
import type { CmsConfig } from '../../types/public';
import type { FileParser } from '../../types/public';
import type { FileFormatter } from '../../types/public';
import type { CustomPreviewRenderer } from '../../types/private';
import type { EditorComponentDefinition } from '../../types/public';
import type { AppEventListener } from '../../types/public';
import type { CustomFieldControl } from '../../types/public';
import type { CustomFieldPreview } from '../../types/public';
import type { CustomFieldSchema } from '../../types/public';
import type { CustomPreviewTemplate } from '../../types/public';
export { getFieldType as getWidget, registerFieldType as registerWidget, renderRichText };
