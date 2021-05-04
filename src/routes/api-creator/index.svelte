<script lang="ts">
  let text = ''

  function safe() {
    console.log('saving...')
  }
</script>

<h1>API Creator</h1>

<form on:submit|preventDefault={safe}>
  <fieldset>
    <input type="text" bind:value={text} />
  </fieldset>
  <button type="submit"> save </button>
</form>

<style lang="stylus">

</style>
