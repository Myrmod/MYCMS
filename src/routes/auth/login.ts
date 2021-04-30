import stringHash from 'string-hash'
import * as cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'
import { Database } from 'arangojs'
import jwt from 'jsonwebtoken'

import beusers from '$lib/database/arangodb/schemas/beusers'
import generateJWT from './generateJWT'

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

export async function post({
  body,
}): Promise<{
  status: number
  headers?: any
  body: {
    message: string
  }
}> {
  try {
    let usedDB = db

    if (!(await db.listDatabases()).includes(VITE_DB_NAME)) {
      console.info(`database "${VITE_DB_NAME}" does not exists. Creating it...`)
      await db.createDatabase(VITE_DB_NAME)
    }
    usedDB = db.database(VITE_DB_NAME)

    // check if collection exists, if not create it with provided user
    const usersCol = usedDB.collection('beusers')

    // create the collection if it doesn't exist
    if (!(await usersCol.exists())) {
      console.info(`collection "beusers" does not exists. Creating it...`)
      await usersCol.create({
        schema: beusers,
      })

      console.info('No user exists. Creating with passed credentials...')
      await usersCol.save({
        _key: uuidv4(),
        email: `${stringHash(body.email)}`,
        password: `${stringHash(body.password)}`,
      })

      const token = await generateJWT(usedDB, usersCol, body)
      const refresh = await generateJWT(usedDB, usersCol, body, 'refresh')

      if (token && refresh) return {
        status: 201,
        headers: {
          'Set-Cookie': [
            cookie.serialize('jwt', token, {
              httpOnly: true,
              maxAge: 60 * 10,
              sameSite: 'strict',
              path: '/',
            }),
            cookie.serialize('refresh', refresh, {
              httpOnly: true,
              maxAge: body.remember ? 60 * 60 * 24 * 7 : undefined,
              sameSite: 'strict',
              path: '/',
            }),
          ],
        },
        body: {
          message: 'new user created',
        },
      }
    } else {
      console.info('checking if requested user exists...')

      const token = await generateJWT(usedDB, usersCol, body)
      const refresh = await generateJWT(usedDB, usersCol, body, 'refresh')

      if (token && refresh) {
        console.info('found requested user')

        return {
          status: 200,
          headers: {
            'Set-Cookie': [
              cookie.serialize('jwt', token, {
                httpOnly: true,
                maxAge: 60 * 10,
                sameSite: 'strict',
                path: '/',
              }),
              cookie.serialize('refresh', refresh, {
                httpOnly: true,
                maxAge: body.remember ? 60 * 60 * 24 * 7 : undefined,
                sameSite: 'strict',
                path: '/',
              }),
            ],
          },
          body: {
            message: 'user logged in',
          },
        }
      }
    }
  } catch (error) {
    console.error(error.message)

    return {
      status: 500,
      body: {
        message: error.message,
      },
    }
  }
  console.info("couln't find requested user. Blocking access.")

  return {
    status: 403,
    body: {
      message: "couldn't login with passed credentials",
    },
  }
}
