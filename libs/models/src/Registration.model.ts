import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import mongoose from 'mongoose'

export type RegistrationDocument = HydratedDocument<Registration>

@Schema()
export class Registration {
  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: mongoose.Schema.Types.Date, default: () => new Date() })
  createdAt: Date

  @Prop({ type: mongoose.Schema.Types.Date, default: () => new Date() })
  lastValidatedAt: Date
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration)