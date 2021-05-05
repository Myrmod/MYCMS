<script lang="ts">
  import APICreator from '$lib/components/APICreator/index.svelte'

  let openAPICreator = false
</script>

<h1>API Creator</h1>

<!-- <form on:submit|preventDefault={safe}>
  <label>
    Route:
    <input type="text" bind:value={route} />
  </label>
  <fieldset>
    <legend>Content</legend>
    <label>
      Test
      <input type="text" bind:value={test} />
    </label>
  </fieldset>
  <button type="submit"> save </button>
</form> -->
<button type="button" on:click={() => (openAPICreator = true)}> Add item </button>

{#if openAPICreator}
  <APICreator bind:open={openAPICreator} />
{/if}

<style lang="stylus">

</style>
