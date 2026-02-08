import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

export function MongoDbConnection() {
  return [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: async (service: ConfigService) => ({
        uri: service.get<string>("MONGODB_URL")
      }),
      inject: [ConfigService]
    })
  ]
}