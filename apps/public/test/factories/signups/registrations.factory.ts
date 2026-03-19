import { INestApplication } from '@nestjs/common';
import { Registration } from '@synple/common';

async function defaults(
  overrides: Partial<Registration>,
): Promise<Partial<Registration>> {
  return {
    email: overrides.email ?? 'test@email.com',
  };
}

export async function RegistrationsFactory(
  app: INestApplication,
  overrides: Partial<Registration> = {},
): Promise<Registration> {
  const model: typeof Registration = app.get('RegistrationRepository');
  return model.create({ ...(await defaults(overrides)), ...overrides });
}
