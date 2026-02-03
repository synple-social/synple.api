import Mongoose from "mongoose"

export const PreRegistrationSchema = new Mongoose.Schema({
  email: { type: String },
  confirmationCode: { type: String },
  sentAt: { type: Date, null: true }
}, {
  timestamps: true
})

export const PreRegistration = Mongoose.model('PreRegistration', PreRegistrationSchema)