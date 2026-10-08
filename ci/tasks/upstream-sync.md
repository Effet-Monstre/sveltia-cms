<!-- cspell:words Effet Monstre kranq -->

# Syncing this fork with upstream

`docs/fork.md` lists every way this fork differs from upstream and the files each difference lives in. That table is the contract: after the merge, every row still holds, and the gates below prove it. Read each listed file in its merged state, not only the ones git reported as conflicting.

When a customization had to move to follow upstream, update its row in `docs/fork.md` in the same pull request.

Upstream ships a `CLAUDE.md`. Keep this line directly under its first heading, adding it if the merge brought the file in:

```md
> This is the Effet Monstre fork. Read `docs/fork.md` before changing anything.
```

## Gates

Bring the project up per `ci/tasks/setup.md` after the merge, then run every gate, in full, and get each one green.

1. **Static checks.** Every `pnpm check:*` script except `check:audit`, each on its own so one failure does not hide another. Fix what they report in fork code.
2. **Build.** `pnpm build`. It comes before the tests because `vite.config.js` loads the configuration schema from the committed `package/schema/sveltia-cms.json`: until the build rewrites it, the tests validate against the schema of the previous release and fail on upstream’s new options.
3. **Unit and component tests.** `pnpm test`.
4. **End-to-end tests.** `pnpm test:e2e`, against the bundle the build wrote. This includes the fork’s own specs in `e2e/specs/fork/`.
5. **Screenshots.** See below.

`pnpm check:audit` is not a gate. Put what it reports in the summary.

## The fork’s end-to-end specs

`e2e/specs/fork/` holds one spec file per row of the customization table in `docs/fork.md`, written with upstream’s harness in `e2e/` (read `e2e/README.md`). If a row has no spec yet, write it in this run. Each spec drives the built bundle the way a user would and checks what the user sees or what the CMS writes:

- **`api` backend and automatic sign-in**: a config with `backend: { name: api }` opens straight on the collections, with no sign-in screen.
- **Custom preview renderers**: a renderer registered with `CMS.registerCustomPreviewRenderer` before `init`, returning HTML built from the entry values, shows that HTML in the preview pane and updates it when a field changes.
- **Tables in rich text**: inserting a table through the dialog and saving writes a Markdown table to the entry file.
- **No machine translation and no revert**: no translate button and no “Revert changes” item anywhere in the editor of a multilingual entry.
- **Copy from another locale**: copying the whole entry from the other locale writes the source values unchanged.
- **Expanders start collapsed**: an object field without a `collapsed` option starts collapsed.

A spec only counts if it fails without the customization. For each new spec, revert just its customization, watch the spec fail, and restore it. Say in the summary that you did.

## Screenshots

With the specs passing, save these to `ci-artifacts/screenshots/` from a headless Chromium session against the built bundle:

- the collection list right after the page loads;
- an entry whose collection has a custom preview renderer, with the rendered preview visible;
- the rich text editor holding a table inserted through the dialog.

Look at each one. Judge it as an editor using the fork would: anything missing, overlapping, unstyled or showing raw markup is a failure to fix, even when every test passed. Describe each screenshot in one line in the summary.

## Versioning and release

Once every gate is green:

1. Read upstream’s version from `git show upstream/main:package.json`. Take its `major.minor`.
2. List our tags for it: `git tag --list 'v<major>.<minor>.*'`. The new patch is `1111` if none of them has a four-digit repeated-digit patch, otherwise the next digit after the highest one (`2222` after `1111`). After `9999`, stop and say so: that needs a decision from a person.
3. Set `version` in `package.json` to `<major>.<minor>.<patch>`.
4. `pnpm build`, then `git add -A -f package package.json`, and commit with the subject `chore: release v<version>`.
5. Write the version, alone, to `ci-artifacts/version`. The workflow tags `v<version>` on the merged commit; do not create the tag yourself.
