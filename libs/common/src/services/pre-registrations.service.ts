import { Injectable } from '@nestjs/common'
import { MailerService } from './mailer.service'
import { DocumentNotFoundException, generateConfirmationCode, MailerUnavailableException } from '@synple/utils';
import { PreRegistration } from '../entities/pre-registration.entity';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PreRegistrationsService {

  constructor(
    @InjectConnection() public readonly connection: Sequelize,
    @InjectModel(PreRegistration) public readonly model: typeof PreRegistration,
    private mailerService: MailerService
  ) { }

  async create(email: string) {
    await this.invalidateAll(email)
    const confirmationCode = generateConfirmationCode()
    await this.connection.transaction(async () => {
      await this.model.create({ email, confirmationCode })
      await this.mailerService.sendSubscriptionConfirmation(email, confirmationCode)
    })
  }

  async findOrFail(where: Partial<{ email: string, confirmationCode?: string }>): Promise<PreRegistration> {
    const result = await this.model.findOne({ where })
    if (result === null) throw new DocumentNotFoundException('email')
    return result
  }

  private async invalidateAll(email: string) {
    await this.model.update({ invalidatedAt: new Date() }, { where: { email } })
  }
}
