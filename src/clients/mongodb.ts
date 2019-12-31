import config from "config"
import { Db, MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || config.get<string>("database.uri")
const dbName = config.get<string>("database.name")
console.log("URI", uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let connection: MongoClient

export const connectMongo = async () => {
  await client
    .connect()
    .then(conn => {
      connection = conn
    })
    .catch(err => {
      console.log("Unable to connect to mongodb!")
      console.log(err)
    })
}

export const mongodb = (): Db => {
  return connection.db(dbName)
}

export const disconnectMongo = async () => {
  return client.close()
}
