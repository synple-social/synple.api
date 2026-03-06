import { Module } from "@nestjs/common";
import { TokensController } from "./tokens.controller";
import { Account, PreRegistration, Registration, TokensService, UuidsService } from "@synple/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  controllers: [TokensController],
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Account, Registration, PreRegistration])
  ],
  providers: [TokensService, UuidsService]
})
export class TokensModule { }