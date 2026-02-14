import { MongooseModule } from '@nestjs/mongoose'
import { Registration, RegistrationSchema } from './Registration.model'
import { PreRegistration, PreRegistrationSchema } from './pre-registration.model'
import { Account, AccountSchema } from './account.model'

export * from './pre-registration.model'
export * from './Registration.model'

export const modelImports = {
  preRegistrations: MongooseModule.forFeature([{ name: PreRegistration.name, schema: PreRegistrationSchema }]),
  registrations: MongooseModule.forFeature([{ name: Registration.name, schema: RegistrationSchema }]),
  accounts: MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
}