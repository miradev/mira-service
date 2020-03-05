import { compare, encodeBase64, genSalt, hash } from 'bcryptjs'
import * as crypto from 'crypto'
import { Collection } from 'mongodb'
import { mongodb } from '../clients/mongodb'
import { EventType, WebsocketEvent } from '../sockets/events'
import { Collections, IDeviceConnection } from '../types/definitions'

const collection = (): Collection<IDeviceConnection> => {
  return mongodb().collection(Collections.CONNECTIONS)
}

export const connectDevice = (deviceId: string): Promise<WebsocketEvent> => {
  const arr = crypto.randomBytes(256)
  const authToken = encodeBase64(arr, 128)
  return genSalt()
    .then(salt => {
      return hash(authToken, salt)
    })
    .then(hashed => {
      return collection().updateOne({ deviceId }, { deviceId, hash: hashed }, { upsert: true })
    })
    .then(() => {
      return {
        type: EventType.REGISTER,
        data: authToken,
      }
    })
}

export const authDevice = (deviceId: string, authToken: string): Promise<boolean> => {
  return collection()
    .findOne({ deviceId })
    .then(connection => {
      if (connection) {
        return compare(authToken, connection.hash)
      }
      return false
    })
}
