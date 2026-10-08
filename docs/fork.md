<!-- cspell:words Effet Monstre kranq Kranqfile pdq -->

# The Effet Monstre fork

This repository is a fork of [sveltia/sveltia-cms](https://github.com/sveltia/sveltia-cms). It adds a few features our projects need, hides a few that they must not expose, and ships its own build so a project can install it straight from a Git tag.

## Customizations

Each entry names the files the change lives in. When upstream moves that code, the change moves with it.

| Change | Files |
| --- | --- |
| **`api` backend**: entries and assets come from the host application, not from Git. The entry list is read with `GET /admin/entries`, a save with `POST /admin/entries` and a delete with `DELETE /admin/entries`; an asset is read through `GET /admin/entries/show?handle=<path>`. Every request carries the page’s `csrf-token` meta tag. | `src/lib/services/backends/fs/api.js`, `src/lib/services/backends/fs/shared/files2.js`, registered in `src/lib/services/backends/index.js`, `ApiBackend` and `BackendName` in `src/lib/types/public.js` |
| **Automatic sign-in**: the app signs in with the configured backend as soon as the config is loaded, with no sign-in screen. | `src/lib/components/app.svelte` |
| **Custom preview renderers**: `CMS.registerCustomPreviewRenderer(collectionName, factory)` replaces the built-in preview of that collection. `factory(element)` returns an async function that receives the entry values and resolves to HTML, which is shown in an iframe. | `src/lib/services/api/index.js` (the `CMS` object), `src/lib/services/api/registries.js` (`customPreviewRenderers`), `src/lib/components/contents/details/preview/entry-preview.svelte`, `src/lib/components/contents/details/preview/preview-renderer.svelte`, `CustomPreviewRenderer` in `src/lib/types/private.js` |
| **Tables in rich text**: a built-in `table` editor component with an insert dialog for rows and columns. | `src/lib/components/contents/details/fields/rich-text/rich-text-editor.svelte`, `insert-table-dialog.svelte` beside it, `BUILTIN_COMPONENTS` in `src/lib/services/contents/fields/rich-text/index.js`, `RichTextEditorComponentName` in `src/lib/types/public.js`, `insert_table`, `table_rows`, `table_cols` and `editor_components.table` in `src/lib/locales/en-US.yaml`, `en-GB.yaml`, `en-CA.yaml` and `ja.yaml`, `@lexical/table` in `package.json` |
| **No machine translation and no revert**: the translate buttons and every “Revert changes” menu item are hidden, in the pane header, the toolbar and the field editor. Upstream’s Restore Default and Clear commands, which sit in the same menus, are kept. The field editor offers neither the translate button nor the copy of a single field, which does nothing here, so its options menu is left with Restore Default and Clear and is hidden when neither applies. | `src/lib/components/contents/details/pane-header.svelte`, `toolbar.svelte`, `editor/field-editor.svelte` |
| **Copy from another locale** copies the values of the whole entry as they are, without translating. Copying a single field does nothing, and so does any copy while either locale has no values yet. | `src/lib/components/contents/details/editor/copy-menu-items.svelte` |
| **Expanders start collapsed**: `getInitialExpanderState` defaults `collapsed` to `true`. | `src/lib/services/contents/editor/fields.js` |

Upstream tests that assert the behaviour one of these rows deliberately changes are adjusted to the fork’s behaviour, each with a comment pointing back here. The fork’s own end-to-end specs, one per row, live in `e2e/specs/fork/`.

If upstream ships an equivalent of one of these, prefer the upstream version once it produces the same output for our projects, and remove ours from this table in the same change.

## Consumers

Projects install a tag, for example `"@sveltia/cms": "git+https://github.com/Effet-Monstre/sveltia-cms.git#v0.166.1111"`, and import the committed bundle directly:

```js
const Sveltia = await import('@sveltia/cms/package/dist/sveltia-cms.mjs');
```

So `package/` is committed build output, even though `.gitignore` lists it. Rebuild it with `pnpm build` and stage it with `git add -A -f package`, which also picks up new chunk files and removes stale ones.

## Versioning

A release is upstream’s `major.minor` with a four-digit patch made of one repeated digit: `1111` for the first release on that `major.minor`, then `2222`, and so on. For example, the first release on upstream 0.232.x is `0.232.1111`, and the next one on the same upstream minor is `0.232.2222`. The version goes in `package.json`, and the build copies it to `package/package.json`. The tag is `v<version>` on the commit that lands on `main`.

## Upstream sync

`.github/workflows/upstream-sync.yml` runs every Monday and on demand. It sends this repository to kranq, our build machine, which runs the `upstream-sync` task from the infrastructure repository. That task merges `upstream/main`, resolves conflicts, runs every gate in `ci/tasks/upstream-sync.md` and opens a pull request. The workflow then merges the pull request and tags the release.

`Kranqfile` defines the build image and `ci/tasks/setup.md` how the project comes up in it.

The workflow needs these repository settings:

| Name | Kind | Value |
| --- | --- | --- |
| `KRANQ_URL` | secret | The kranq push URL, `ssh://user@host:port/~/kranq.git` |
| `KRANQ_SSH_KEY` | secret | Private key trusted by the kranq machine and registered as an access key on the infrastructure repository |
| `SYNC_TOKEN` | secret | Fine-grained token for this repository: Contents, Pull requests and Workflows, all read and write. `GITHUB_TOKEN` cannot push the upstream changes to `.github/workflows/`. |
| `INFRASTRUCTURE_REF` | variable | Optional. Branch of the infrastructure repository to use, `main` by default. |

Run it by hand with `gh workflow run upstream-sync.yml`. Set `merge` to `false` to open the pull request without merging it.
