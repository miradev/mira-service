import express from 'express'
import config from 'config'
import {connectMongo} from "./clients/mongodb"
import {createWidget} from "./collections/widgets";
const app = express()
const port = config.get<number>('service.port')
app.use(express.json())

app.get('/', (_, res) => {
  res.send('Welcome to the Mira backend service!')
})

app.post('/widgets', async (req, res) => {
  res.send(await createWidget(req.body))
})

console.log(`Server started on port ${port}`)
app.listen(port, () => {
  connectMongo()
})
