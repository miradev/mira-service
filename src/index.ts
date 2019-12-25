import express from 'express'
import {test} from "./clients/mongodb"
const app = express()

app.get('/', (_, res) => {
  res.send('Welcome to the Mira backend service!')
})

app.get('/test', (_, res) => {
  test()
  res.send('Check logs')
})

console.log("Server started on port 8000")
app.listen(8000)
