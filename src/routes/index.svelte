<script lang="ts">
  import Login from '$lib/components/Login.svelte'

  export let isLoggedIn = false
</script>

<section>
  {#if !isLoggedIn}
    <Login />
  {:else}
    <h1>You are logged in</h1>
  {/if}
</section>

<style lang="stylus">

</style>
