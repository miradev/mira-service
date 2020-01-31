import config from 'config'
import express from 'express'
import { connectMongo } from './clients/mongodb'
import {
  createWidget,
  deleteWidget,
  getAllWidgets,
  getWidget,
  updateWidget,
} from './collections/widgets'
import { isCreateWidgetRequest, isUpdateWidgetRequest } from './guards'
import { badObjectId, validate, validateId, validationFailed } from './helpers'
const app = express()
const port = config.get<number>('service.port')
app.use(express.json())

app.get('/', (_, res) => {
  res.send('Welcome to the Mira backend service!')
})

// TODO: Add OAuth
app.post('/widgets', async (req, res) => {
  validate(req.body, isCreateWidgetRequest, validationFailed(res)) &&
    res.send(await createWidget(req.body))
})

app.get('/widgets', async (_, res) => {
  res.send(await getAllWidgets())
})

app.get('/widgets/:id', async (req, res) => {
  const id = validateId(req.params.id, badObjectId(res))
  id && res.send(await getWidget(id))
})

app.put('/widgets/:id', async (req, res) => {
  const id = validateId(req.params.id, badObjectId(res))
  id &&
    validate(req.body, isUpdateWidgetRequest, validationFailed(res)) &&
    res.send(await updateWidget(id, req.body))
})

app.delete('/widgets/:id', async (req, res) => {
  const id = validateId(req.params.id, badObjectId(res))
  id && res.send(await deleteWidget(id))
})

app.listen(port, async () => {
  console.log(`Server started on port ${port}`)
  await connectMongo()
})
