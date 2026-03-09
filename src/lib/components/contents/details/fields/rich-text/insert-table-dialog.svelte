<!--
  @component
  Display a dialog to configure the dimensions of a new table before it is inserted into the rich
  text editor.
-->
<script>
  import { Dialog, NumberInput } from '@sveltia/ui';
  import { _ } from 'svelte-i18n';

  /**
   * @typedef {object} Props
   * @property {boolean} [open] Whether the dialog is open.
   * @property {(rows: number, cols: number) => void} [onConfirm] Called with the chosen dimensions
   * when the user clicks OK.
   * @property {() => void} [onCancel] Called when the user cancels or dismisses the dialog.
   */

  /** @type {Props} */
  let { open = $bindable(false), onConfirm, onCancel } = $props();

  let rows = $state(3);
  let cols = $state(3);

  const componentId = $props.id();

  $effect(() => {
    if (open) {
      rows = 3;
      cols = 3;
    }
  });
</script>

<Dialog
  bind:open
  title={$_('insert_table')}
  okLabel={$_('insert')}
  okDisabled={!rows || !cols || rows < 1 || cols < 1}
  onOk={() => {
    onConfirm?.(rows, cols);
  }}
  onCancel={() => {
    onCancel?.();
  }}
>
  <div role="none" class="fields">
    <section>
      <div role="none">
        <h3 id="{componentId}-rows-label">{$_('table_rows')}</h3>
      </div>
      <div role="none">
        <NumberInput
          flex
          bind:value={rows}
          min={1}
          max={100}
          step={1}
          aria-labelledby="{componentId}-rows-label"
        />
      </div>
    </section>
    <section>
      <div role="none">
        <h3 id="{componentId}-cols-label">{$_('table_cols')}</h3>
      </div>
      <div role="none">
        <NumberInput
          flex
          bind:value={cols}
          min={1}
          max={100}
          step={1}
          aria-labelledby="{componentId}-cols-label"
        />
      </div>
    </section>
  </div>
</Dialog>

<style lang="scss">
  .fields {
    display: table;
    margin: 16px 0 0;
    width: 100%;

    section {
      display: table-row;

      div {
        display: table-cell;
        vertical-align: middle;
        white-space: nowrap;

        &:last-child {
          width: 90%;
        }
      }

      h3 {
        margin-inline-end: 8px;
        font-size: inherit;
      }
    }
  }
</style>
