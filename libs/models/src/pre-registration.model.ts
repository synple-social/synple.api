import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { EMAIL_FORMAT } from '@synple/utils'
import { generateConfirmationCode } from '@synple/utils'
import mongoose from "mongoose"
import { Registration, RegistrationSchema, type RegistrationDocument } from "./Registration.model";

export type PreRegistrationDocument = HydratedDocument<PreRegistration>

@Schema()
export class PreRegistration {
  @Prop({ type: Date, default: () => new Date() })
  createdAt?: Date

  @Prop({ required: true, type: String, match: EMAIL_FORMAT })
  email: string

  @Prop({ type: String, default: () => generateConfirmationCode() })
  confirmationCode?: string

  @Prop({ type: Date })
  sentAt?: Date

  @Prop({ type: Boolean, default: () => false })
  invalidated?: boolean
}

export const PreRegistrationSchema = SchemaFactory.createForClass(PreRegistration)