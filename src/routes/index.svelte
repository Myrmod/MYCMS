<script lang="ts">
  import Login from '$lib/components/Login.svelte'
  import { authenticated } from '$lib/stores/userStore'
</script>

<main>
  {#if !$authenticated}
    <Login />
  {:else}
    <h1>You are logged in</h1>
  {/if}
</main>

<style lang="stylus">

</style>
