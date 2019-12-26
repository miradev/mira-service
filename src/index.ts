import config from "config"
import express from "express"
import { connectMongo } from "./clients/mongodb"
import { createWidget, getAllWidgets } from "./collections/widgets"
import { isCreateWidgetRequest } from "./guards"
import { validate, validationFailed } from "./helpers"
const app = express()
const port = config.get<number>("service.port")
app.use(express.json())

app.get("/", (_, res) => {
  res.send("Welcome to the Mira backend service!")
})

// TODO: Add OAuth
app.post("/widgets", async (req, res) => {
  validate(req.body, isCreateWidgetRequest, validationFailed(res)) &&
    res.send(await createWidget(req.body))
})

app.get("/widgets", async (_, res) => {
  res.send(await getAllWidgets())
})

console.log(`Server started on port ${port}`)
app.listen(port, () => {
  connectMongo()
})
