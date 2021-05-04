<script lang="ts">
  import type { SidebarNavItem } from './interfaces'

  export let items: Array<SidebarNavItem> = []
  let openSidebar = true
</script>

<aside data-open={openSidebar}>
  <button type="button" on:click={() => (openSidebar = !openSidebar)} aria-pressed={openSidebar}>
    Toggle Sidebar
  </button>
  <nav>
    <ul>
      {#each items as item}
        {#if item.label}
          <li>
            <b>
              {item.name}
            </b>
          </li>
        {:else}
          <li>
            <a href={item.href} preload="true">
              {item.name}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>
</aside>

<style lang="stylus">
  aside
    position relative
    width 30rem
    height 100%
    box-shadow: 0 0 .5rem 0 #000
    transition transform 200ms ease, width 200ms ease

    &[data-open='false']
      transform translateX(-100%)
      width 0

    button
      position absolute
      right 0
      transform translateX(100%)
      box-shadow: 0 0 .5rem 0 #000

    nav
      overflow-x hidden

      ul
        list-style none
        padding 0
        margin 0

        li
          a,
          b
            height 4rem
            width 100%
            display flex
            align-items center
            padding-left 2rem

          a
            text-decoration none
</style>
