import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

export function MongoDbConnection() {
  return [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URL")
      }),
      inject: [ConfigService]
    })
  ]
}