import { Module } from '@nestjs/common';
import { SynthesizersModule } from './synthesizers/synthesizers.module';
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
    SynthesizersModule,
    EntitiesModule,
  ],
})
export class AppModule {}
