import { connectMongo, disconnectMongo } from '../../clients/mongodb'
import { createUser, passportLogin } from '../../collections/users'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await disconnectMongo()
})

describe('users', () => {
  const creds = { username: 'TestUser', password: 'hunter2', email: 'example@gmail.com' }
  describe('createUser', () => {
    it('Succeeds with a valid username and password', async () => {
      const response = await createUser(creds.username, creds.password, creds.email)
      expect(response.success).toBe(true)
    })
    it('Fails with a duplicate username', async () => {
      const response = await createUser(creds.username, creds.password, creds.email)
      expect(response.success).toBe(false)
    })
  })
  describe('login', () => {
    it('Succeeds if the user exists and password is correct', async () => {
      let success = false
      await passportLogin(creds.username, creds.password, (err, user) => {
        if (err) {
          throw err
        }
        if (user !== undefined) {
          success = true
        }
      })
      expect(success).toBe(true)
    })
  })
})
