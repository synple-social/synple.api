import { MongoMemoryServer } from "mongodb-memory-server"

beforeAll(async () => {
  const server = await MongoMemoryServer.create()
  process.env.MONGODB_URL = server.getUri()
})