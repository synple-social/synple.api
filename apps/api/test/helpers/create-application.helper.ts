import { Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesModule } from '@synple/common';
import { SynthesizersModule } from 'apps/api/src/synthesizers/synthesizers.module';
import { AuthModule } from 'apps/public/src/auth/auth.module';

export type TestOverride = { from: any; to: any };

export type TestingModuleOptions<TModule> = {
  module: TModule;
  overrides?: TestOverride[];
};

async function createTestingModule<TModule extends Type<any>>({
  module: moduleUnderTest,
  overrides,
}: TestingModuleOptions<TModule>) {
  let module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: ['.env.test.local'],
        isGlobal: true,
      }),
      SequelizeModule.forRoot({
        dialect: 'sqlite',
        autoLoadModels: true,
        logging: false,
      }),
      EntitiesModule,
      AuthModule,
      moduleUnderTest,
    ],
  });
  for (const { from, to } of overrides || []) {
    module = module.overrideProvider(from).useClass(to);
  }
  return await module.compile();
}

async function createAppFromModule(module: TestingModule) {
  const app = module.createNestApplication();
  await app.init();
  return app;
}

export async function createApplication<TModule extends Type<any>>({
  module,
  overrides,
}: TestingModuleOptions<TModule>) {
  return await createAppFromModule(
    await createTestingModule({ module, overrides }),
  );
}
