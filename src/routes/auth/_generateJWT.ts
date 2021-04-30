import type { Database } from 'arangojs'
import type { DocumentCollection, EdgeCollection } from 'arangojs/collection'
import jwt from 'jsonwebtoken'
import stringHash from 'string-hash'

export default async function generateJWT(
  db: Database,
  col: DocumentCollection<any> & EdgeCollection<any>,
  passedUser: {
    password: string
    email: string
  },
  key = 'default',
): Promise<string> {
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
            FILTER user.password == "${stringHash(
              passedUser.password,
            )}" && user.email == "${stringHash(passedUser.email)}"
            RETURN user
          \`.toArray()[0];
      }
    `,
  )

  if (user) {
    switch (key) {
      case 'refresh':
        return jwt.sign(user, `${import.meta.env.VITE_JWT_REFRESH}`)

      default:
        return jwt.sign(user, `${import.meta.env.VITE_JWT_KEY}`)
    }
  }

  return null
}
