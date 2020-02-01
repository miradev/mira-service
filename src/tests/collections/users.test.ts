import { connectMongo, disconnectMongo } from '../../clients/mongodb'
import { createUser } from '../../collections/users'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await disconnectMongo()
})

describe('users', () => {
  describe('createUser', () => {
    it('Succeeds with a valid username and password', async () => {
      const response = await createUser('TestUser', 'hunter2')
      expect(response.success).toBe(true)
    })
  })
})
