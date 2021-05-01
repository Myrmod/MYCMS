import * as cookie from 'cookie'
import refreshJWT from './refreshJWT'

export async function getContext({
  headers,
}): Promise<{
  authenticated: boolean
}> {
  console.log('getcontext')

  const cookies = cookie.parse(`${headers.cookie}`)

  if (!cookies?.jwt) {
    if (cookies.refresh) {
      const val = await refreshJWT(cookies.refresh)

      return val
    }

    return {
      authenticated: false,
    }
  }

  return {
    authenticated: true,
  }
}

export function getSession({ context }) {
  console.log('getSession')

  return context
}

export async function handle({ request, render }) {
  console.log('handle', request.context.headers)

  const response = await render(request)

  return {
    ...response,
    headers: {
      ...response.headers,
      ...request.context.headers,
    },
  }
}
