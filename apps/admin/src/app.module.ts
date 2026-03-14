import { Module } from '@nestjs/common';
import { ScopesModule } from './scopes/scopes.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntitiesModule } from '@synple/common';
import { RolesModule } from './roles/roles.modules';

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
        }
      },
      inject: [ ConfigService]
    }),
    EntitiesModule,
    ScopesModule,
    RolesModule,
  ],
})
export class AppModule {}
