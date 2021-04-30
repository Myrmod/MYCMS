<script lang='ts'>
import { authenticated } from "$lib/stores/userStore"

  async function logout() {
    const res = await fetch('/auth/logout');
    console.log('logout:',res);

    authenticated.update(v => v = false)
  }
</script>

<header>
  <button
    type='button'
    on:click={logout}
  >
    Logout
  </button>
</header>