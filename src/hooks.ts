import * as cookie from 'cookie'

export async function getContext({ headers }): Promise<{
  authenticated: boolean;
}> {
  const cookies = cookie.parse(`${headers.cookie}`)

  if (!cookies?.jwt) {
    return {
      authenticated: false,
    }
  }

  return {
    authenticated: true,
  }
}

export function getSession({ context }) {
  return context
}