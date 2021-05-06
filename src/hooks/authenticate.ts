import * as cookie from 'cookie'
import refreshJWT from './refreshJWT'
import { Database } from 'arangojs'
import dotenv from 'dotenv'

export default async function authenticate({
  headers,
}): Promise<{ authenticated: boolean, headers?: any}> {
  const {
    DB_PORT,
    DB_NAME,
    DB_URL,
    DB_USERNAME,
    DB_PASSWORD,
  } = dotenv.config().parsed

  if (!DB_URL) throw new Error('no database url provided')
  if (!DB_PORT) throw new Error('no database port provided')
  if (!DB_NAME) throw new Error('no database name provided')

  const db = new Database({
    url: `${DB_URL}:${DB_PORT}`,
    auth: {
      username: DB_USERNAME,
      password: DB_PASSWORD,
    },
  })

  if (!(await db.listDatabases()).includes(DB_NAME)) {
    return {authenticated: false}
  }

  const cookies = cookie.parse(`${headers.cookie}`)

  if (!cookies?.jwt) {
    if (cookies.refresh) {
      const val = await refreshJWT(cookies.refresh)

      return val
    }

    return {authenticated: false}
  }

  return {authenticated: true}
}