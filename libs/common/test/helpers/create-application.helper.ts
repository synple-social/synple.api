import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'apps/public/src/auth/auth.module';

export type TestOverride = { from: any; to: any };

export type TestingModuleOptions = { overrides?: TestOverride[], underTest: any[] };

async function createTestingModule(
  { overrides, underTest }: TestingModuleOptions = { overrides: [], underTest: [] },
) {
  let module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
      SequelizeModule.forRoot({
        dialect: 'sqlite',
        autoLoadModels: true,
        logging: false,
      }),
      AuthModule,
      ...underTest
    ],
  });
  if (overrides) {
    for (const override of overrides) {
      module = module.overrideProvider(override.from).useClass(override.to);
    }
  }
  return await module.compile();
}

async function createAppFromModule(module: TestingModule) {
  const app = module.createNestApplication();
  await app.init();
  return app;
}

export async function createApplication(
  { overrides, underTest }: TestingModuleOptions = { overrides: [], underTest: [] },
) {
  const module = await createTestingModule({ overrides, underTest });
  return await createAppFromModule(module);
}
