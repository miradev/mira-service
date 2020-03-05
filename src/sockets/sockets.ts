import * as WebSocket from 'ws'
import { authDevice } from '../collections/connections'
import { WebsocketEvent } from './events'

export interface Connection {
  socket: WebSocket
  isAuth: boolean
}

export class WebSocketConnections {
  private connections: Map<string, Connection>

  constructor() {
    this.connections = new Map<string, Connection>()
  }

  public register(deviceId: string, ws: WebSocket) {
    this.connections.set(deviceId, { socket: ws, isAuth: false })
  }

  public auth(deviceId: string, authToken: string, ws: WebSocket) {
    authDevice(deviceId, authToken).then(isAuth => {
      if (isAuth) {
        this.connections.set(deviceId, { socket: ws, isAuth: true })
      } else {
        ws.close(1008)
      }
    })
  }

  public isAuth(deviceId: string) {
    const conn = this.connections.get(deviceId)
    if (conn !== undefined) {
      return conn.isAuth
    }
    return false
  }

  public send(deviceId: string, message: WebsocketEvent) {
    const connection = this.connections.get(deviceId)
    if (connection) {
      connection.socket.send(JSON.stringify(message))
    } else {
      throw new Error('Send to invalid socket')
    }
  }

  public disconnect(deviceId: string) {
    const conn = this.connections.get(deviceId)
    conn && conn.socket.close()
  }

  public has(deviceId: string) {
    return this.connections.has(deviceId)
  }

  public get(deviceId: string) {
    return this.connections.get(deviceId)
  }
}
