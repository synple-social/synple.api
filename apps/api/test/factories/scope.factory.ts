import { Scope } from '@synple/common';
import { createFactory } from '../helpers/create-factory.helper';

export const scopeFactory = createFactory<Scope>(Scope, {
  slug: () => 'test::scope',
  uuid: () => '2',
});
