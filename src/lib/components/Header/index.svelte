<script lang="ts">
  import { authenticated } from '$lib/stores/userStore'
  import Menu from './Menu/index.svelte'

  async function logout() {
    const res = await fetch('/auth/logout')
    console.log('logout:', res)

    authenticated.update(v => (v = false))
  }
</script>

<header>
  <Menu />
  <button type="button" on:click={logout}> Logout </button>
</header>

<style lang="stylus">
  header
    display flex
    height 5rem
    align-items center
    padding 0 1rem

    button
      margin-left auto
</style>
