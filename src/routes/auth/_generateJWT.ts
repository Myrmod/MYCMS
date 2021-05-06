import refreshtokens from '$lib/database/arangodb/schemas/refreshtokens'
import { Database } from 'arangojs'
import type { DocumentCollection, EdgeCollection } from 'arangojs/collection'
import jwt from 'jsonwebtoken'
import stringHash from 'string-hash'
import dotenv from 'dotenv'

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
    DB_PORT,
    DB_NAME,
    DB_URL,
    DB_USERNAME,
    DB_PASSWORD,
  } = dotenv.config().parsed

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
      const token = jwt.sign(user, `${dotenv.config().parsed.JWT_REFRESH}`)

      const db = new Database({
        url: `${DB_URL}:${DB_PORT}`,
        databaseName: `${DB_NAME}`,
        auth: {
          username: DB_USERNAME,
          password: DB_PASSWORD,
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

    return jwt.sign(user, `${dotenv.config().parsed.JWT_KEY}`)
  }

  return null
}
