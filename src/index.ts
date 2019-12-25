import express from 'express'
import {connectMongo} from "./clients/mongodb"
import {createWidget} from "./collections/widgets";
const app = express()
app.use(express.json())

app.get('/', (_, res) => {
  res.send('Welcome to the Mira backend service!')
})

app.post('/widgets', async (req, res) => {
  res.send(await createWidget(req.body))
})

console.log("Server started on port 8000")
app.listen(8000, () => {
  connectMongo()
})
