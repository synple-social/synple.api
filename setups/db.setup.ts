import { MongoMemoryServer } from "mongodb-memory-server"

let server: MongoMemoryServer

beforeAll(async () => {
  server = await MongoMemoryServer.create()
  process.env.MONGODB_URL = server.getUri()
})

afterAll(async () => {
  await server.stop()
})