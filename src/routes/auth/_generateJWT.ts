import refreshtokens from '$lib/database/arangodb/schemas/refreshtokens'
import { Database } from 'arangojs'
import type { DocumentCollection, EdgeCollection } from 'arangojs/collection'
import jwt from 'jsonwebtoken'
import stringHash from 'string-hash'

export default async function generateJWT(
  db: Database,
  col: DocumentCollection<any> & EdgeCollection<any>,
  passedUser: {
    password: string
    email: string
    remember: boolean
    hashed?: boolean
  },
  key = 'default',
): Promise<string> {
  const {
    VITE_DB_PORT,
    VITE_DB_NAME,
    VITE_DB_URL,
    VITE_DB_USERNAME,
    VITE_DB_PASSWORD,
  } = import.meta.env

  const hashedPassword = passedUser.hashed ? passedUser.password : stringHash(passedUser.password)
  const hashedEmail = passedUser.hashed ? passedUser.email : stringHash(passedUser.email)

  const user = await db.executeTransaction(
    {
      read: ['beusers'],
    },
    `
      function() {
        // This code will be executed inside ArangoDB!
        const { query } = require("@arangodb");
        return query\`
            FOR user IN ${col.name}
            FILTER user.password == "${hashedPassword}" && user.email == "${hashedEmail}"
            RETURN user
          \`.toArray()[0];
      }
    `,
  )

  if (user) {
    if (key === 'refresh') {
      const token = jwt.sign(user, `${import.meta.env.VITE_JWT_REFRESH}`)

      const db = new Database({
        url: `${VITE_DB_URL}:${VITE_DB_PORT}`,
        databaseName: `${VITE_DB_NAME}`,
        auth: {
          username: VITE_DB_USERNAME,
          password: VITE_DB_PASSWORD,
        },
      })

      const tokenCol = db.collection('refreshtokens')

      // create the collection if it doesn't exist
      if (!(await tokenCol.exists())) {
        console.info(`collection "beusers" does not exists. Creating it...`)
        await tokenCol.create({
          schema: refreshtokens,
        })

        await tokenCol.ensureIndex({
          type: 'ttl',
          fields: ['expireDate'],
          expireAfter: 0,
        })
      }

      console.log('trying to save token', token)
      await tokenCol.save(
        {
          token,
          expireDate: passedUser.remember
            ? Date.now() + 60 * 60 * 24 * 7
            : new Date().setUTCHours(0, 0, 0, 0),
        },
        {
          silent: true,
        },
      )

      console.log('saved token successfully')

      return token
    }

    return jwt.sign(user, `${import.meta.env.VITE_JWT_KEY}`)
  }

  return null
}
