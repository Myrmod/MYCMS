import stringHash from 'string-hash'
import * as cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'
import { Database } from 'arangojs'
import dotenv from 'dotenv'

import beusers from '$lib/database/arangodb/schemas/beusers'
import generateJWT from './_generateJWT'

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

    let usedDB = db

    if (!(await db.listDatabases()).includes(DB_NAME)) {
      console.info(`database "${DB_NAME}" does not exists. Creating it...`)
      await db.createDatabase(DB_NAME)
    }
    usedDB = db.database(DB_NAME)

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
        role: 'admin'
      })

      const token = await generateJWT(usedDB, usersCol, body)
      const refresh = await generateJWT(usedDB, usersCol, body, 'refresh')

      if (token && refresh)
        return {
          status: 201,
          headers: {
            'set-cookie': [
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
            'set-cookie': [
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
