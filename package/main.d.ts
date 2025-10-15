export default CMS;
declare namespace CMS {
    export { init };
    export { registerCustomFormat };
    export { registerCustomPreviewRenderer };
    export { registerEditorComponent };
    export { registerEventListener };
    export { registerPreviewStyle };
    export { registerPreviewTemplate };
    export { registerWidget };
}
/**
 * Initialize the CMS, optionally with the given site configuration.
 * @param {object} [options] Options.
 * @param {SiteConfig} [options.config] Configuration to be merged with `config.yml`. Include
 * `load_config_file: false` to prevent the configuration file from being loaded.
 * @see https://decapcms.org/docs/manual-initialization/
 */
export function init({ config }?: {
    config?: SiteConfig;
}): Promise<void>;
/**
 * Register a custom entry file format.
 * @param {string} name Format name. This should match the `format` option of a collection where the
 * custom format will be used..
 * @param {string} extension File extension.
 * @param {{ fromFile?: FileParser, toFile?: FileFormatter }} methods Parser and/or formatter
 * methods. Async functions can be used.
 * @see https://decapcms.org/docs/custom-formatters/
 */
declare function registerCustomFormat(name: string, extension: string, { fromFile, toFile }: {
    fromFile?: FileParser;
    toFile?: FileFormatter;
}): void;
/**
 * Register a custom preview renderer.
 * @param {string} name Renderer name.
 * @param {any} fn Renderer function.
 */
declare function registerCustomPreviewRenderer(name: string, fn: any): void;
/**
 * Register a custom component.
 * @param {EditorComponentDefinition} definition Component definition.
 * @see https://decapcms.org/docs/custom-widgets/#registereditorcomponent
 */
declare function registerEditorComponent(definition: EditorComponentDefinition): void;
/**
 * Register an event listener.
 * @param {AppEventListener} eventListener Event listener.
 * @see https://decapcms.org/docs/registering-events/
 */
declare function registerEventListener(eventListener: AppEventListener): void;
/**
 * Register a custom preview stylesheet.
 * @param {string} style URL, file path or raw CSS string.
 * @param {object} [options] Options.
 * @param {boolean} [options.raw] Whether to use a CSS string.
 * @throws {TypeError} If `style` is not a string, or `raw` is not a boolean.
 * @see https://decapcms.org/docs/customization/#registerpreviewstyle
 */
declare function registerPreviewStyle(style: string, { raw }?: {
    raw?: boolean;
}): void;
/**
 * Register a custom preview template.
 * @param {string} name Template name.
 * @param {ComponentType<CustomPreviewTemplateProps>} component React component.
 * @see https://decapcms.org/docs/customization/#registerpreviewtemplate
 */
declare function registerPreviewTemplate(name: string, component: ComponentType<CustomPreviewTemplateProps>): void;
/**
 * Register a custom widget.
 * @param {string} name Widget name.
 * @param {ComponentType<CustomWidgetControlProps> | string} control Component for the edit pane.
 * @param {ComponentType<CustomWidgetPreviewProps>} [preview] Component for the preview pane.
 * @param {CustomWidgetSchema} [schema] Field schema.
 * @see https://decapcms.org/docs/custom-widgets/
 */
declare function registerWidget(name: string, control: ComponentType<CustomWidgetControlProps> | string, preview?: ComponentType<CustomWidgetPreviewProps>, schema?: CustomWidgetSchema): void;
import type { SiteConfig } from './types/public';
import type { FileParser } from './types/public';
import type { FileFormatter } from './types/public';
import type { EditorComponentDefinition } from './types/public';
import type { AppEventListener } from './types/public';
import type { CustomPreviewTemplateProps } from './types/public';
import type { ComponentType } from 'react';
import type { CustomWidgetControlProps } from './types/public';
import type { CustomWidgetPreviewProps } from './types/public';
import type { CustomWidgetSchema } from './types/public';
