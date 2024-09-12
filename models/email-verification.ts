import mongoose, { Document, model, models, ObjectId } from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface EmailVerificationInterface extends Document {
  account: ObjectId;
  OTP: string;
  expiresAt: Date;
}

const emailVerificationSchema: Schema<EmailVerificationInterface> = new Schema(
  {
    account: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account',
      required: true,
    },
    OTP: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      // default: () => Date.now(),
      // expires: 60 * 5
      default: () => Date.now() + 300000 /* 5 minutes in milliseconds */,
      expires: 0,
      immutable: true,
    },
  },
  { timestamps: true }
);

emailVerificationSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed_OTP = await bcrypt.hash(this.OTP, salt);
    this.OTP = hashed_OTP;
  } catch (error: any) {
    next(error);
  }

  next();
});

const EmailVerification =
  models.EmailVerification ||
  model('EmailVerification', emailVerificationSchema);

export default EmailVerification;
