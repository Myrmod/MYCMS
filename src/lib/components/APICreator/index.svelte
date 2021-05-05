<script lang="ts">
  import ContentElementSelector from './ContentElementSelector/index.svelte'

  export let open = false

  function safe() {
    console.log('saving...')
  }
</script>

<dialog on:click|self={() => (open = false)}>
  <div>
    <button type="button" aria-label="close dialog" on:click={() => (open = false)} />
    <h1>Select and configure your item</h1>
    <ContentElementSelector />
  </div>
</dialog>

<style lang="stylus">
  dialog
    position fixed
    background rgba(0, 0, 0, .5)
    padding 5rem
    display block
    width 100vw
    height 100vh
    top 0
    border none

    div
      background #fff
      padding 2rem
      position relative
      width 100%
      height 100%

      button
        position absolute
        top 1rem
        right 1rem

      h1
        margin 0
        margin-bottom 2rem

</style>
