import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesModule } from '@synple/common';
import { RolesModule } from 'apps/admin/src/roles/roles.modules';
import { ScopesModule } from 'apps/admin/src/scopes/scopes.module';

export type TestOverride = { from: any; to: any };

export type TestingModuleOptions = { overrides: TestOverride[] };

async function createTestingModule(
  { overrides }: TestingModuleOptions = { overrides: [] },
) {
  let module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
      SequelizeModule.forRoot({
        dialect: 'sqlite',
        autoLoadModels: true,
        logging: false,
      }),
      EntitiesModule,
      ScopesModule,
      RolesModule,
    ],
  });
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
