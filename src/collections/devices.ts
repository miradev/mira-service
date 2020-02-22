import { Collection, TransactionOptions } from 'mongodb'
import { getSession, mongodb } from '../clients/mongodb'
import { createErrorResponse } from '../helpers'
import { Collections, IDevice } from '../types/definitions'
import { CreateDeviceResponse } from '../types/responses'
import { addDevice } from './users'

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
                return {
                  success: false,
                  description: 'Could not update user profile',
                }
              }
            })
            .catch(createErrorResponse)
        })
        .catch(createErrorResponse)
    }, transactionOptions)
    .then(() => {
      return result
    })
}
