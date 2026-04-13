import { Injectable } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { DocumentNotFoundException } from '@synple/utils';
import { PreRegistration } from '../entities/pre-registration.entity';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfirmationCodesService } from './confirmation-codes.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PreRegistrationsService {
  constructor(
    @InjectConnection() public readonly connection: Sequelize,
    @InjectModel(PreRegistration) public readonly model: typeof PreRegistration,
    private mailerService: MailerService,
    private confirmationCodes: ConfirmationCodesService,
  ) {}

  async create(email: string): Promise<PreRegistration> {
    await this.invalidateAll(email);
    const confirmationCode = this.confirmationCodes.generate();
    return await this.connection.transaction<PreRegistration>(async () => {
      const preRegistration = await this.model.create({
        email,
        confirmationCode,
        uuid: uuid(),
      });
      await this.mailerService.sendSubscriptionConfirmation(
        email,
        confirmationCode,
      );
      return preRegistration;
    });
  }

  async findOrFail(
    where: Partial<{ email: string; confirmationCode?: string }>,
  ): Promise<PreRegistration> {
    const result = await this.model.findOne({ where });
    if (result === null) throw new DocumentNotFoundException('email');
    return result;
  }

  private async invalidateAll(email: string) {
    await this.model.update(
      { invalidatedAt: new Date() },
      { where: { email } },
    );
  }
}
