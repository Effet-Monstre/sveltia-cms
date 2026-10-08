import { expect } from '@playwright/test';

/**
 * @import { Locator } from '@playwright/test';
 */

/**
 * Open every collapsed Object field and List item within the given scope. This fork starts the
 * expanders collapsed, where upstream starts them open, so a test that reaches the subfields of an
 * object or a list item has to open it first.
 * @param {Locator} scope Element to look in, e.g. the content editor or one field group.
 * @see ../../docs/fork.md
 */
export const expandAll = async (scope) => {
  // A disabled expander has nothing to show, e.g. an item of a list without subfields
  const collapsed = scope.locator('[aria-label="Expand"]:not([aria-disabled="true"])');

  // Opening an item can reveal nested ones, so keep going until nothing is left to open
  await expect(async () => {
    if (await collapsed.count()) {
      await collapsed.first().click();
    }

    await expect(collapsed).toHaveCount(0, { timeout: 1000 });
  }).toPass();
};
