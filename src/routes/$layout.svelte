<script context="module" lang="ts">
  import { authenticated } from '$lib/stores/userStore'

  export async function load({ page, session }) {
    try {
      authenticated.update(v => (v = session.authenticated))

      if (!session.authenticated && page.path !== '/') {
        return {
          status: 302,
          redirect: '/',
        }
      }

      return {}
    } catch (error) {
      console.error(error)

      return {}
    }
  }
</script>

<script lang="ts">
  import '../styles/app.styl'
  import Header from '$lib/components/Header/index.svelte'
</script>

{#if !$authenticated}
  <main>
    <slot />
  </main>
{:else}
  <Header />
  <slot />
{/if}
