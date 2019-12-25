import {MongoClient} from "mongodb";

// const uri = "mongodb+srv://dbAdmin:<password>@miradev-tdjtt.mongodb.net/test?retryWrites=true&w=majority"
const uri = "mongodb://127.0.0.1:3000/local"
const client = new MongoClient(uri, { useNewUrlParser: true })

export const test = () => {
  client.connect(async (err: Error) => {
    const collection = client.db("dev").collection("widgets")
    await collection.insertOne({name: "test"})
    const item = collection.findOne((err: any, res: any) => {
      console.log(res)
    })
    // perform actions on the collection object
    client.close()
  });
}
