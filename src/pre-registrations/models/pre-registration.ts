import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { generateConfirmationCode } from "src/utils/generateConfirmationCode";

export type PreRegistrationDocument = HydratedDocument<PreRegistration>

@Schema()
export class PreRegistration {
  @Prop({ required: true, unique: true, type: String })
  email: string

  @Prop({ default: () => generateConfirmationCode(6) })
  confirmationCode: string

  @Prop()
  sentAt: Date
}

export const PreRegistrationSchema = SchemaFactory.createForClass(PreRegistration)