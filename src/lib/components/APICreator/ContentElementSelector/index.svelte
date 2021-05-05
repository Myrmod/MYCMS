<script lang="ts">
  import Select from 'svelte-select'
  import type { SelectItem } from './interface'
  import translations from '$lib/translations/en.json'

  const complexItems = [
    {
      value: 'text',
      label: translations.ContentElement.text,
      group: translations.ContentElementGroup.basic,
    },
    {
      value: 'textarea',
      label: translations.ContentElement.textarea,
      group: translations.ContentElementGroup.basic,
    },
    {
      value: 'checkbox',
      label: translations.ContentElement.checkbox,
      group: translations.ContentElementGroup.basic,
    },
    {
      value: 'rte',
      label: translations.ContentElement.rte,
      group: translations.ContentElementGroup.complex,
    },
    {
      value: 'number',
      label: translations.ContentElement.number,
      group: translations.ContentElementGroup.basic,
    },
  ] as Array<SelectItem>

  const groupBy = (item: SelectItem) => item.group
</script>

<Select items={complexItems} {groupBy} />
