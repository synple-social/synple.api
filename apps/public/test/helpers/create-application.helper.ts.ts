import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationCodesService } from '@synple/common';
import { ConfirmationCodesMock } from '../mocks/confirmation-codes.mock';
import { PasswordsModule } from 'apps/public/src/passwords/passwords.module';
import { AuthModule } from 'apps/public/src/auth/auth.module';
import { SignupsModule } from 'apps/public/src/signups/signups.module';
import { JwtModule } from '@nestjs/jwt';

export type TestOverride = { from: any; to: any };

export type TestingModuleOptions = { overrides: TestOverride[] };

async function createTestingModule(
  { overrides }: TestingModuleOptions = { overrides: [] },
) {
  let module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
      JwtModule.register({
        global: true,
        secret: 'test secret',
        secretOrPrivateKey: 'test secret key'
      }),
      SequelizeModule.forRoot({
        dialect: 'sqlite',
        storage: ":memory:",
        autoLoadModels: true,
        logging: false,
      }),
      SignupsModule,
      PasswordsModule,
      AuthModule,
    ],
  });
  overrides.push({ from: ConfirmationCodesService, to: ConfirmationCodesMock });
  for (const override of overrides) {
    module = module.overrideProvider(override.from).useClass(override.to);
  }
  return await module.compile();
}

async function createAppFromModule(module: TestingModule) {
  const app = module.createNestApplication();
  await app.init();
  return app;
}

export async function createApplication(
  { overrides }: TestingModuleOptions = { overrides: [] },
) {
  const module = await createTestingModule({ overrides });
  return await createAppFromModule(module);
}
