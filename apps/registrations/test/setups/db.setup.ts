import { MongoMemoryServer } from "mongodb-memory-server"
import { vi, beforeAll } from "vitest"

beforeAll(async () => {
  console.log("Creating in memory DB for tests")
  vi.stubEnv("MONGODB_URL", (await MongoMemoryServer.create()).getUri())
})