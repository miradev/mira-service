import { connectMongo, disconnectMongo } from '../../clients/mongodb'
import { createUser, passportLogin } from '../../collections/users'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await disconnectMongo()
})

describe('users', () => {
  const credentials = { username: 'TestUser', password: 'hunter2' }
  describe('createUser', () => {
    it('Succeeds with a valid username and password', async () => {
      const response = await createUser(credentials.username, credentials.password)
      expect(response.success).toBe(true)
    })
    it('Fails with a duplicate username', async () => {
      const response = await createUser(credentials.username, credentials.password)
      expect(response.success).toBe(false)
    })
  })
  describe('login', () => {
    it('Succeeds if the user exists', async () => {
      let success = false
      await passportLogin(credentials.username, credentials.password, (err, user) => {
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
