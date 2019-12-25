import {Db, MongoClient} from "mongodb";

// const uri = "mongodb+srv://dbAdmin:<password>@miradev-tdjtt.mongodb.net/test?retryWrites=true&w=majority"
const uri = "mongodb://127.0.0.1:3000/local"
const db_name = "dev"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let connection: MongoClient

export const connectMongo = () => {
  client.connect().then(conn => {
    connection = conn
  }).catch(err => {
    console.log('Unable to connect to mongodb!')
    console.log(err)
  })
}

export const mongodb = (): Db => {
  return connection.db(db_name)
}