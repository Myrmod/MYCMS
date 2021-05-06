import restAPI from "$lib/database/arangodb/schemas/restAPI"
import { Database } from "arangojs"
import dotenv from 'dotenv'

export async function get({ path }) {
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
      databaseName: DB_NAME,
      auth: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
      },
    })

    // check if collection exists, if not create it with provided user
    const restAPICol = db.collection('restAPI')

    // create the collection if it doesn't exist
    if (!(await restAPICol.exists())) {
      console.info(`collection "restAPI" does not exists. Creating it...`)
      await restAPICol.create({
        schema: restAPI,
      })

      return {
        status: 404,
        body: 'no api endpoints are defined yet',
      }
    }

    return {
      status: 200,
      body: 'here is nothing implemented yet :)'
    }
  } catch (error) {
    console.error(error)

    return {
      status: 500,
      body: error,
    }
  }
}