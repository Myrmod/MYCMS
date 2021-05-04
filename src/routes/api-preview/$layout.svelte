<script lang="ts">
  import Sidebar from '$lib/components/Sidebar/index.svelte'
  import type { SidebarNavItem } from '$lib/components/Sidebar/interfaces'

  const items = [
    {
      name: 'General',
      href: '/api-preview',
    },
  ] as Array<SidebarNavItem>
</script>

<div>
  <Sidebar {items} />
  <main>
    <slot />
  </main>
</div>

<style lang="stylus">
  div
    display flex
    height 100%

    main
      width 100%
      padding 2rem
</style>
