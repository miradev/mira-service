import { Collection, TransactionOptions } from 'mongodb'
import { getSession, mongodb } from '../clients/mongodb'
import { createErrorResponse } from '../helpers'
import { Collections, IDevice } from '../types/definitions'
import { CreateDeviceResponse, GetDeviceResponse } from '../types/responses'
import { addDevice, hasDevice } from './users'

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
    }).catch(createErrorResponse)
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
