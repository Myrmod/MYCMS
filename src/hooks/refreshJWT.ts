import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import generateJWT from '../routes/auth/_generateJWT'
import { Database } from 'arangojs'
import dotenv from 'dotenv'

export default async function refreshJWT(refreshToken: string) {
  try {
    const {
    DB_PORT,
    DB_NAME,
    DB_URL,
    DB_USERNAME,
    DB_PASSWORD,
  } = dotenv.config().parsed

  if (!refreshToken) {
    return {
      status: 401,
      authenticated: false,
    }
  }

  const db = new Database({
    url: `${DB_URL}:${DB_PORT}`,
    databaseName: `${DB_NAME}`,
    auth: {
      username: DB_USERNAME,
      password: DB_PASSWORD,
    },
  })

  const token = await db.executeTransaction(
    {
      read: ['refreshtokens'],
    },
    `
      function() {
        // This code will be executed inside ArangoDB!
        const { query } = require("@arangodb");
        return query\`
            FOR item IN refreshtokens
            FILTER item.token == "${refreshToken}"
            RETURN item
          \`.toArray()[0];
      }
    `,
  )

  if (!token)
    return {
      status: 403,
      authenticated: false,
    }

  return jwt.verify(
    refreshToken,
    `${dotenv.config().parsed.JWT_REFRESH}`,
    async (err, user: { email: string; password: string }) => {
      if (err) {
        console.error(err)

        return {
          status: 401,
          body: {
            message: err,
          }
        }
      }

      const token = await generateJWT(db, db.collection('beusers'), {
        email: user.email,
        password: user.password,
        remember: false,
        hashed: true,
      })

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
          ],
        },
        body: {
          message: 'jwt refreshed',
        },
        authenticated: true,
      }
    },
  )
  } catch (error) {
    console.error(error)

    return  {
      status: 403,
      authenticated: false,
    }
  }
}
