import sveltePreprocess from 'svelte-preprocess'
import node from '@sveltejs/adapter-node'
import svg from '@netulip/rollup-plugin-svg'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svg'],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    sourceMap: true,
    stylus: {
      prependData: '@require "src/styles/prepend.styl"',
    },
  }),
  kit: {
    // By default, `npm run build` will create a standard Node app.
    // You can create optimized builds for different platforms by
    // specifying a different adapter
    adapter: node(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    vite: {
      ssr: {},
      plugins: [
        svg.default({ enforce: 'pre' }),
        // {
        //   name: 'vite-plugin-agnostic-axe',
        //   transformIndexHtml(html, ctx) {
        //     if (ctx.server?.config.mode !== 'development') return html

        //     const snippet = `
        //       <script>
        //         import('https://unpkg.com/agnostic-axe@3').then(
        //           ({ AxeObserver, logViolations }) => {
        //             const MyAxeObserver = new AxeObserver(logViolations)
        //             MyAxeObserver.observe(document)
        //           }
        //         )
        //       </script>
        //     `
        //     html = html.replace('</body>', snippet + '</body>')

        //     return html
        //   }
        // },
      ],
      resolve: {
        alias: {
          '$icons': path.resolve('src/assets/icons')
        }
      }
    },

    files: {
      assets: 'static',
      hooks: 'src/hooks',
      lib: 'src/lib',
      routes: 'src/routes',
      serviceWorker: 'src/service-worker',
      template: 'src/app.html',
    },
  },
}
