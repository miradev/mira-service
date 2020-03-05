import config from 'config'
import express from 'express'
import session from 'express-session'
import * as fs from 'fs'
import multer from 'multer'
import passport from 'passport'
import * as passportLocal from 'passport-local'
import * as path from 'path'
import * as WebSocket from 'ws'
import { connectMongo, createSessionStore } from './clients/mongodb'
import { connectDevice } from './collections/connections'
import { createDevice, getDevice, updateDevice } from './collections/devices'
import {
  createUser,
  getCurrentUser,
  hasDevice,
  passportLogin,
  updateUser,
} from './collections/users'
import {
  createWidget,
  deleteWidget,
  getAllWidgets,
  getAllWidgetsByUserId,
  getWidget,
  updateWidget,
} from './collections/widgets'
import { isCreateWidgetRequest, isSignupRequest, isUpdateWidgetRequest } from './guards'
import {
  badObjectId,
  createUploadWidgetResponse,
  socketNotFound,
  validate,
  validateId,
  validationFailed,
  widgetFilter,
  widgetName,
} from './helpers'
import { EventType, WebsocketEvent } from './sockets/events'
import { WebSocketConnections } from './sockets/sockets'

const connections = new WebSocketConnections()
const app = express()
const port = config.get<number>('service.port')
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})
// TODO: load from config
const fileDir = 'uploads'
const uploadWidget = multer({
  storage: multer.diskStorage({ destination: fileDir, filename: widgetName }),
  fileFilter: widgetFilter,
})
app.use(
  session({
    // TODO: add to config
    secret: 'secret',
    saveUninitialized: true,
    resave: false,
    store: createSessionStore(),
  }),
)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
const LocalStrategy = passportLocal.Strategy
passport.use(new LocalStrategy(passportLogin))
const isAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Mira API
app.get('/', (_, res) => {
  res.send('Welcome to the Mira backend service!')
})

app.post('/signup', async (req, res) => {
  console.log(req.body)
  validate(req.body, isSignupRequest, validationFailed(res)) &&
    res.send(await createUser(req.body.username, req.body.password, req.body.email, req.body.dev))
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.send(req.user)
})

app.get('/logout', async (req, res) => {
  await req.logout()
  res.redirect('/')
})

app.get('/currentUser', isAuth, async (req, res) => {
  const userId = (req.user as any)._id.toHexString()
  return userId ? res.send(await getCurrentUser(userId)) : validationFailed(res)()
})

app.put('/currentUser', isAuth, async (req, res) => {
  const userId = (req.user as any)._id.toHexString()
  return userId ? res.send(await updateUser(userId, req.body)) : validationFailed(res)()
})

app.post('/widgets/upload', isAuth, uploadWidget.single('widget'), async (req, res) => {
  console.log(req.file)
  res.send(createUploadWidgetResponse(req.file))
})

app.get('/files/:id', (req, res) => {
  const fullPath = path.resolve(fileDir, req.params.id)
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath)
  } else {
    res.send('File not found')
  }
})

app.post('/widgets', isAuth, async (req, res) => {
  const userId = (req.user as any)._id.toHexString()
  validate(req.body, isCreateWidgetRequest, validationFailed(res)) &&
    validateId(req.body._id, badObjectId(res)) &&
    res.send(await createWidget(req.body, userId))
})

app.get('/widgets', async (req, res) => {
  const { userId } = req.params
  if (userId !== undefined) {
    return res.send(await getAllWidgetsByUserId(userId))
  }
  res.send(await getAllWidgets())
})

app.get('/widgets/:id', async (req, res) => {
  const id = req.params.id
  id && res.send(await getWidget(id))
})

app.put('/widgets/:id', isAuth, async (req, res) => {
  const id = req.params.id
  id &&
    validate(req.body, isUpdateWidgetRequest, validationFailed(res)) &&
    res.send(await updateWidget(id, req.body))
})

app.delete('/widgets/:id', isAuth, async (req, res) => {
  const id = req.params.id
  return id ? res.send(await deleteWidget(id)) : validationFailed(res)()
})

app.post('/users/:id/devices', isAuth, async (req, res) => {
  console.log(req.body)
  const deviceName = req.body.name
  const id = req.body._id
  return deviceName && id
    ? res.send(await createDevice(deviceName, id, req.params.id))
    : validationFailed(res)()
})

app.get('/users/:userId/devices/:deviceId', isAuth, async (req, res) => {
  console.log('Get device request', req.user)
  const userId = (req.user as any)._id.toHexString()
  const deviceId = req.params.deviceId
  return userId && deviceId ? res.send(await getDevice(userId, deviceId)) : validationFailed(res)()
})

app.put('/users/:userId/devices/:deviceId', isAuth, async (req, res) => {
  const userId = (req.user as any)._id.toHexString()
  const deviceId = req.params.deviceId
  return userId && deviceId
    ? res.send(await updateDevice(userId, deviceId, req.body))
    : validationFailed(res)()
})

app.post('/users/:userId/devices/:deviceId/connect', isAuth, async (req, res) => {
  const userId = (req.user as any)._id.toHexString()
  const deviceId = req.params.deviceId
  if (connections.has(deviceId)) {
    if (userId && (await hasDevice(userId, deviceId))) {
      const socketMessage = await connectDevice(deviceId)
      connections.send(deviceId, socketMessage)
      connections.disconnect(deviceId)
      res.send({ success: true })
    } else {
      validationFailed(res)()
    }
  } else {
    socketNotFound(res)
  }
})

const server = app.listen(port, async () => {
  console.log(`Server started on port ${port}`)
  await connectMongo()
})

const wss = new WebSocket.Server({ server })

wss.on('connection', (ws: WebSocket) => {
  // connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    // log the received message and send it back to the client
    const event: WebsocketEvent = JSON.parse(message)
    const type = event.type
    if (type === EventType.REGISTER) {
      console.log('Register event received')
      const { deviceId } = event.data
      connections.register(deviceId, ws)
    } else if (type === EventType.AUTH) {
      console.log('Auth event received')
      const { deviceId, token } = event.data
      connections.auth(deviceId, token, ws)
    } else {
      ws.send('Unrecognized event')
    }
    console.log(event)
  })
})
