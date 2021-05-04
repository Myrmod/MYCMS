import restAPI from "$lib/database/arangodb/schemas/restAPI"
import { Database } from "arangojs"

export async function get({ path }) {
  try {
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
      databaseName: VITE_DB_NAME,
      auth: {
        username: VITE_DB_USERNAME,
        password: VITE_DB_PASSWORD,
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