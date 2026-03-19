import { INestApplication } from '@nestjs/common';
import { Role } from '@synple/common';

function defaults(): Partial<Role> {
  return { name: 'test', uuid: 'test', isDefault: false };
}

export async function rolesFactory(
  app: INestApplication,
  overrides: Partial<Role> = {},
): Promise<Role> {
  const model: typeof Role = app.get('RoleRepository');
  return await model.create({ ...defaults(), ...overrides });
}
