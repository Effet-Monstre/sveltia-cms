<!-- cspell:words kranq Kranqfile nvmrc -->

# Bringing this project up in CI

The image built from `Kranqfile` already holds Node at the version `.nvmrc` pinned when it was built, pnpm, a warm pnpm store and Playwright’s Chromium with its system libraries. What is left needs the checkout:

```sh
bash ci/tasks/install-node.sh
export PATH=/opt/ci/node/bin:$PATH
CI=true pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

`install-node.sh` does nothing when the installed Node already matches `.nvmrc`. Run all four again after anything changes `.nvmrc`, `package.json` or `pnpm-lock.yaml`, a merge from upstream included.

## Traps

- **`engineStrict` is on.** pnpm refuses to install with a Node that does not satisfy `engines`, so a merge that moves `.nvmrc` needs `install-node.sh` before `pnpm install`, not after.
- **Without `CI=true`, pnpm asks before replacing `node_modules`**, gets no answer here, and exits with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`.
- **A lockfile conflict is resolved by pnpm, not by hand.** Take either side of `pnpm-lock.yaml`, finish `package.json`, then run `CI=true pnpm install --no-frozen-lockfile` and commit the lockfile it writes.
- **`pnpm-workspace.yaml` sets `minimumReleaseAge`.** A version published in the last day is not installable yet. That is policy, so leave it alone.
- **`package/` is committed build output that `.gitignore` excludes.** `git add -A` skips it. Stage it with `git add -A -f package` after `pnpm build`.
- **The end-to-end tests run against the built bundle.** Run `pnpm build` before `pnpm test:e2e`. The test server takes port 4180; set `E2E_PORT` if that port is busy.
- **`pnpm check:audit` depends on the npm advisory database of the day.** Report what it finds, but it is not a gate.

## Checking that it worked

```sh
pnpm test:unit
```

It runs without a browser, in a couple of minutes. On a tree that predates that script, run `pnpm test`.
