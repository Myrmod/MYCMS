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
  import { onMount } from 'svelte'

  if (import.meta.env.DEV) {
    onMount(() => {
      import('https://unpkg.com/agnostic-axe@3').then(({ AxeObserver, logViolations }) => {
        const MyAxeObserver = new AxeObserver(logViolations)
        MyAxeObserver.observe(document)
      })
    })
  }
</script>

{#if !$authenticated}
  <main>
    <slot />
  </main>
{:else}
  <Header />
  <slot />
{/if}
