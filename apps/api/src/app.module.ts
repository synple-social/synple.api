import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';
import { JwtService } from '@nestjs/jwt';
import { EntitiesModule } from '@synple/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

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
    ToolsModule,
    EntitiesModule
  ]
})
export class AppModule {}
