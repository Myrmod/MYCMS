import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import generateJWT from '../routes/auth/_generateJWT'
import { Database } from 'arangojs'

export default async function refreshJWT(refreshToken: string) {
  try {
    const {
    VITE_DB_PORT,
    VITE_DB_NAME,
    VITE_DB_URL,
    VITE_DB_USERNAME,
    VITE_DB_PASSWORD,
  } = import.meta.env

  if (!refreshToken) {
    return {
      status: 401,
      authenticated: false,
    }
  }

  const db = new Database({
    url: `${VITE_DB_URL}:${VITE_DB_PORT}`,
    databaseName: `${VITE_DB_NAME}`,
    auth: {
      username: VITE_DB_USERNAME,
      password: VITE_DB_PASSWORD,
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
    `${import.meta.env.VITE_JWT_REFRESH}`,
    async (_err, user: { email: string; password: string }) => {
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
