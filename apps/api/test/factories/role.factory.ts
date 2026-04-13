import { Role } from '@synple/common';
import { createFactory } from '../helpers/create-factory.helper';
import { scopeFactory } from './scope.factory';

export const roleFactory = createFactory<Role>(
  Role,
  {
    name: () => 'TestRole',
    uuid: () => '2',
    isDefault: () => false,
  },
  {
    afterCreate: async (app, role) => {
      role.addScopes([
        await scopeFactory.create(app, { slug: 'synthesizers::read' }),
      ]);
      return role;
    },
  },
);
