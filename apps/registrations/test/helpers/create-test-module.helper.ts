import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { AccountsModule } from "apps/registrations/src/accounts/accounts.module";
import { PreRegistrationsModule } from "apps/registrations/src/pre-registrations/pre-registrations.module";
import { RegistrationsModule } from "apps/registrations/src/registrations/registrations.module";

export type TestOverride = { from: any, to: any }

export type TestingModuleOptions = { overrides: TestOverride[] }

export async function createTestingModule({ overrides }: TestingModuleOptions = { overrides: [] }) {
  let module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: '.env.test.local' }),
      SequelizeModule.forRoot({ dialect: 'sqlite', autoLoadModels: true, logging: false }),
      PreRegistrationsModule,
      RegistrationsModule,
      AccountsModule,
    ]
  })
  for (const override of overrides) {
    module = module.overrideProvider(override.from).useClass(override.to)
  }
  return await module.compile();
}

export async function createAppFromModule(module: TestingModule) {
  const app = module.createNestApplication()
  await app.init()
  return app;
}

export async function createApplication({ overrides }: TestingModuleOptions = { overrides: [] }) {
  const module = await createTestingModule({ overrides })
  return await createAppFromModule(module)
}