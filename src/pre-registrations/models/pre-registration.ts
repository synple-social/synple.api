import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { EMAIL_FORMAT } from "../../../src/utils/constants";
import { generateConfirmationCode } from "../../../src/utils/generateConfirmationCode";

export type PreRegistrationDocument = HydratedDocument<PreRegistration>

@Schema()
export class PreRegistration {
  @Prop({ required: true, type: String, match: EMAIL_FORMAT })
  email: string

  @Prop({ default: () => generateConfirmationCode(6) })
  confirmationCode: string

  @Prop()
  sentAt: Date

  @Prop({ type: Boolean, default: () => false })
  invalidated: boolean
}

export const PreRegistrationSchema = SchemaFactory.createForClass(PreRegistration)