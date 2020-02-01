import config from 'config'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import * as passportLocal from 'passport-local'
import { connectMongo } from './clients/mongodb'
import { createUser, passportLogin } from './collections/users'
import {
  createWidget,
  deleteWidget,
  getAllWidgets,
  getWidget,
  updateWidget,
} from './collections/widgets'
import { isAuthRequest, isCreateWidgetRequest, isUpdateWidgetRequest } from './guards'
import { badObjectId, validate, validateId, validationFailed } from './helpers'
const app = express()
const port = config.get<number>('service.port')
app.use(express.json())
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
  }),
)
app.use(passport.initialize())
app.use(passport.session())
const LocalStrategy = passportLocal.Strategy
passport.use(new LocalStrategy(passportLogin))

app.get('/', (_, res) => {
  res.send('Welcome to the Mira backend service!')
})

app.post('/signup', async (req, res) => {
  validate(req.body, isAuthRequest, validationFailed(res)) &&
    res.send(await createUser(req.body.username, req.body.password))
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
