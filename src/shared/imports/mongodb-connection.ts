import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export function MongoDbConnection() {
  return [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: async (configService: ConfigService) => ({
        uri: await createUri(configService)
      }),
      inject: [ConfigService]
    })
  ]
}

async function createUri(s: ConfigService) {
  if (s.get<string>('NODE_ENV') === 'test') {
    const mongod = await MongoMemoryServer.create()
    return mongod.getUri()
  }
  return s.get<string>("MONGODB_URL")
}