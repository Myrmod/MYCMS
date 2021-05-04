import * as cookie from 'cookie'
import refreshJWT from './refreshJWT'
import { Database } from 'arangojs'

export async function getContext({
  headers,
}): Promise<{
  authenticated: boolean
}> {
  const {
    VITE_DB_PORT,
    VITE_DB_NAME,
    VITE_DB_URL,
    VITE_DB_USERNAME,
    VITE_DB_PASSWORD,
  } = import.meta.env

  if (!VITE_DB_URL) throw new Error('no database url provided')
  if (!VITE_DB_PORT) throw new Error('no database port provided')
  if (!VITE_DB_NAME) throw new Error('no database name provided')

  const db = new Database({
    url: `${VITE_DB_URL}:${VITE_DB_PORT}`,
    auth: {
      username: VITE_DB_USERNAME,
      password: VITE_DB_PASSWORD,
    },
  })

  if (!(await db.listDatabases()).includes(VITE_DB_NAME)) {
    return {
      authenticated: false,
    }
  }

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
  return context
}

export async function handle({ request, render }) {
  const response = await render(request)

  return {
    ...response,
    headers: {
      ...response.headers,
      ...request.context.headers,
    },
  }
}
