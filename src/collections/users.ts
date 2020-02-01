import { genSalt, hash } from 'bcryptjs'
import { Collection } from 'mongodb'
import { mongodb } from '../clients/mongodb'
import { createErrorResponse } from '../helpers'
import { Collections, IUser } from '../types/definitions'
import { CreateUserResponse } from '../types/responses'

const collection = (): Collection<IUser> => {
  return mongodb().collection(Collections.USERS)
}

export const createUser = (username: string, password: string): Promise<CreateUserResponse> => {
  return genSalt()
    .then(salt => {
      return hash(password, salt).then(hashed => {
        return {
          name: username,
          hash: hashed,
          salt,
        }
      })
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
