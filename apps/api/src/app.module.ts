import { Module } from '@nestjs/common';
import { SynthesizersModule } from './synthesizers/synthesizers.module';
import { EntitiesModule } from '@synple/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlueprintsModule } from './blueprints/blueprints.module';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    BlueprintsModule,
    SynthesizersModule,
    EntitiesModule,
  ],
})
export class AppModule {}
