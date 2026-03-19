import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordsModule } from './passwords/passwords.module';
import { AuthModule } from './auth/auth.module';
import { SignupsModule } from './signups/signups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['docker.env', '.env'],
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (service: ConfigService) => {
        return {
          dialect: 'postgres',
          uri: service.get('DATABASE_URL'),
          autoLoadModels: true,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    SignupsModule,
    PasswordsModule,
    AuthModule,
  ],
})
export class AppModule {}
