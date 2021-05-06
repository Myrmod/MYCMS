import { aql, Database } from 'arangojs'
import { collections as neededCollections } from './structure'
import dotenv from 'dotenv'

const { DB_PORT, DB_NAME, DB_URL } = dotenv.config().parsed

export default class DB {
  private static instance: DB
  private database: Database

  private constructor(username: string, password: string) {
    try {
      if (!DB_URL) throw new Error('no database url provided')
      if (!DB_PORT) throw new Error('no database port provided')
      if (!DB_NAME) throw new Error('no database name provided')

      this.database = new Database({
        url: `${DB_URL}:${DB_PORT}`,
        databaseName: DB_NAME,
        auth: { username, password },
      })
    } catch (error) {
      console.error('DB.constructor', error)
    }
  }

  static async getInstance(username: string, password: string): Promise<DB> {
    if (!DB.instance) {
      DB.instance = new DB(username, password)
    }

    return DB.instance
  }

  public async createCollections(): Promise<void> {
    try {
      neededCollections.forEach(async collection => {
        const coll = this.database.collection(collection.name)
        const exists = await coll.exists()

        if (!exists) {
          coll.create({ schema: collection.schema })
          console.log(`created collection ${collection.name}`)
        }
      })
    } catch (error) {
      console.error('DB.createCollections:', error)
    }
  }

  public getDatabase(): Database {
    return this.database
  }
}
