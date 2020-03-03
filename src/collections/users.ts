import { compare, genSalt, hash } from 'bcryptjs'
import { Collection, ObjectId } from 'mongodb'
import { mongodb } from '../clients/mongodb'
import { createErrorResponse } from '../helpers'
import { Collections, IUser, UserTags } from '../types/definitions'
import { CreateUserResponse, GetUserResponse, UpdateUserResponse } from '../types/responses'

const collection = (): Collection<IUser> => {
  return mongodb().collection(Collections.USERS)
}

export const passportLogin = (
  username: string,
  password: string,
  done: (error: any, user?: any) => void,
) => {
  return collection()
    .findOne({ username })
    .then(user => {
      if (user) {
        return compare(password, user.hash).then(success => {
          if (success) {
            return done(null, user)
          }
          return done(null, false)
        })
      }
      return done(null, false)
    })
    .catch(done)
}

export const getCurrentUser = (id: string): Promise<GetUserResponse> => {
  return collection()
    .findOne({ _id: new ObjectId(id) })
    .then(user => {
      if (user) {
        return {
          success: true,
          user,
        }
      }
      return {
        success: false,
      }
    })
    .catch(createErrorResponse)
}

export const createUser = (
  username: string,
  password: string,
  email: string,
  dev: boolean = false,
): Promise<CreateUserResponse> => {
  return genSalt()
    .then(salt => {
      return hash(password, salt)
    })
    .then(hashed => {
      return {
        username,
        email,
        tags: dev ? [UserTags.DEVELOPER] : [],
        hash: hashed,
        devices: [],
      }
    })
    .then(newUser => {
      return collection()
        .insertOne(newUser)
        .then(user => {
          return {
            id: user.insertedId,
            success: true,
          }
        })
        .catch(createErrorResponse)
    })
}

export const updateUser = (userId: string, user: IUser): Promise<UpdateUserResponse> => {
  return collection()
    .updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          username: user.username,
          email: user.email,
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
        description: 'Failed to update user',
      }
    })
    .catch(createErrorResponse)
}

export const addDevice = (userId: string, deviceId: string) => {
  return collection()
    .updateOne({ _id: new ObjectId(userId) }, { $push: { devices: deviceId } })
    .then(res => {
      return res.modifiedCount === 1
    })
}

export const hasDevice = (userId: string, deviceId: string): Promise<boolean> => {
  return collection()
    .findOne({ _id: new ObjectId(userId), devices: deviceId })
    .then(user => !!user)
}
