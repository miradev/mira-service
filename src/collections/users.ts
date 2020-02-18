import { compare, genSalt, hash } from 'bcryptjs'
import { Collection } from 'mongodb'
import { mongodb } from '../clients/mongodb'
import { createErrorResponse } from '../helpers'
import { Collections, IUser, UserTags } from '../types/definitions'
import { CreateUserResponse } from '../types/responses'

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
