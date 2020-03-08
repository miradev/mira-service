import { Collection, TransactionOptions } from 'mongodb'
import { getSession, mongodb } from '../clients/mongodb'
import { createErrorResponse } from '../helpers'
import { EventType, WebsocketEvent } from '../sockets/events'
import { Collections, IDevice, IUser } from '../types/definitions'
import {
  CreateDeviceResponse,
  GetDeviceResponse,
  GetUserSuccess,
  UpdateDeviceResponse,
} from '../types/responses'
import { addDevice, getCurrentUser, hasDevice } from './users'
import { getFileNameMap } from './widgets'

const collection = (): Collection<IDevice> => {
  return mongodb().collection(Collections.DEVICES)
}

export const createDevice = (
  name: string,
  deviceId: string,
  userId: string,
): Promise<CreateDeviceResponse> => {
  const device: IDevice = {
    _id: deviceId,
    name,
    deviceWidgets: [],
    config: {},
  }
  const session = getSession()
  const transactionOptions: TransactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  }
  let result: Promise<CreateDeviceResponse>
  return session
    .withTransaction(async () => {
      result = collection()
        .insertOne(device)
        .then(newDevice => {
          return addDevice(userId, newDevice.insertedId)
            .then(success => {
              if (success) {
                return {
                  id: newDevice.insertedId,
                  success: true,
                }
              } else {
                throw new Error('Could not update user profile')
              }
            })
            .catch(createErrorResponse)
        })
        .catch(createErrorResponse)
    }, transactionOptions)
    .then(() => {
      return result
    })
    .catch(createErrorResponse)
}

export const getDevice = (userId: string, deviceId: string): Promise<GetDeviceResponse> => {
  return hasDevice(userId, deviceId)
    .then(exists => {
      if (exists) {
        return collection()
          .findOne({ _id: deviceId })
          .then(device => {
            if (device) {
              return {
                success: true,
                device,
              }
            }
            return {
              success: false,
              description: 'Device does not exist',
            }
          })
      } else {
        return {
          success: false,
          description: 'You do not own this device',
        }
      }
    })
    .catch(createErrorResponse)
}

export const getAllDevices = (userId: string): Promise<string[]> => {
  return getCurrentUser(userId).then(res => {
    const user: IUser = (res as GetUserSuccess).user
    if (user) {
      return user.devices
    }
    return []
  })
}

export const updateDevice = (
  userId: string,
  deviceId: string,
  device: IDevice,
): Promise<UpdateDeviceResponse> => {
  return hasDevice(userId, deviceId)
    .then(exists => {
      if (exists) {
        return collection()
          .updateOne(
            { _id: deviceId },
            {
              $set: {
                name: device.name,
                config: device.config,
                deviceWidgets: device.deviceWidgets,
              },
            },
          )
          .then(res => {
            if (res.modifiedCount === 1) {
              return {
                success: true,
              }
            }
            return {
              success: false,
              description: 'Failed to update device',
            }
          })
      }
      return {
        success: false,
        description: 'You do not own this device',
      }
    })
    .catch(createErrorResponse)
}

export const pushUpdate = (deviceId: string): Promise<WebsocketEvent> => {
  return collection()
    .findOne({ _id: deviceId })
    .then(device => {
      if (device) {
        return getFileNameMap(...device.deviceWidgets.map(dw => dw.widgetId)).then(fileNameMap => {
          console.log(fileNameMap)
          return new Map<string, object>(
            device.deviceWidgets.map(dw => [
              dw.widgetId,
              { fileName: fileNameMap.get(dw.widgetId), config: dw.config },
            ]),
          )
        })
      }
      throw new Error('Device not found for update')
    })
    .then(aggr => {
      console.log(aggr)
      return {
        type: EventType.UPDATE,
        data: aggr,
      }
    })
}
