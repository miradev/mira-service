import config from 'config'
import { Db, MongoClient } from 'mongodb'
import { Collections } from '../types/definitions'

const uri = process.env.MONGODB_URI || config.get<string>('database.uri')
const dbName = config.get<string>('database.name')
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let connection: MongoClient

export const connectMongo = async () => {
  await client
    .connect()
    .then(conn => {
      connection = conn
      return initDB()
    })
    .catch(err => {
      console.log('Unable to connect to mongodb!')
      console.log(err)
    })
}

export const initDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    mongodb().dropDatabase()
  }
  await mongodb()
    .collection(Collections.USERS)
    .createIndex({ username: 1 }, { unique: true })
}

export const mongodb = (): Db => {
  return connection.db(dbName)
}

export const disconnectMongo = async () => {
  return client.close()
}
