import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import mongoose from 'mongoose'
import { PreRegistration } from "./pre-registration.model";

export type RegistrationDocument = HydratedDocument<Registration>

@Schema()
export class Registration {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PreRegistration' })
  preRegistration: PreRegistration

  @Prop({ type: mongoose.Schema.Types.Date, default: () => new Date() })
  createdAt: Date
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration)