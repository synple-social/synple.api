import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import mongoose from 'mongoose'
import { Registration } from "./Registration.model";

export type AccountDocument = HydratedDocument<Account>

@Schema()
export class Account {
  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: mongoose.Schema.Types.Date, default: () => new Date() })
  createdAt: Date

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Registration.name })
  registration: Registration

  @Prop({ type: String, required: true })
  username: string

  @Prop({ type: String, required: true })
  passwordDigest: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)