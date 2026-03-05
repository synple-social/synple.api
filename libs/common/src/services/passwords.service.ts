import { Injectable } from "@nestjs/common";
import { PasswordRequest } from "../entities/password-request.entity";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { MailerService } from "./mailer.service";
import { ResetPasswordDto } from "apps/registrations/src/passwords/dto/reset-password.dto";
import { BadParameterException, DocumentNotFoundException, generateConfirmationCode, SALT_ROUNDS } from "@synple/utils";
import { hash } from 'bcrypt'
import { Account } from "../entities";
import { Sequelize } from "sequelize-typescript";
import { ConfirmationCodesService } from "./confirmation-codes.service";

@Injectable()
export class PasswordsService {

  constructor(
    @InjectConnection() public readonly connection: Sequelize,
    @InjectModel(PasswordRequest) public readonly model: typeof PasswordRequest,
    @InjectModel(Account) public readonly accounts: typeof Account,
    public readonly mailerService: MailerService,
    private confirmationCodes: ConfirmationCodesService,
  ) { }

  async request(email: string) {
    await this.invalidateAll(email)
    const confirmationCode = this.confirmationCodes.generate()
    const account: Account | null = await this.accounts.findOne({ where: { email } })
    if (account === null) return
    await this.connection.transaction(async () => {
      await this.model.create({ email, confirmationCode, accountId: account.id })
      await this.mailerService.sendPasswordResetRequest(email, confirmationCode)
    })
  }

  async reset({ email, confirmationCode, password, passwordConfirmation }: ResetPasswordDto) {
    const request = await this.findOrFail(email, confirmationCode)
    if (password !== passwordConfirmation) throw new BadParameterException('password', 'confirmation')
    await request.account?.update({ passwordDigest: await hash(password, SALT_ROUNDS) })
  }

  private async invalidateAll(email: string) {
    await this.model.update({ invalidatedAt: new Date() }, { where: { email } })
  }

  private async findOrFail(email: string, confirmationCode: string): Promise<PasswordRequest> {
    const request = await this.model.findOne({ where: { email, confirmationCode }, include: Account })
    if (request === null) throw new DocumentNotFoundException('email')
    return request
  }
}