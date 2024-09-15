import mongoose, { Document, model, models, ObjectId, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface PasswordResetInterface extends Pick<Document, '_id'> {
  account: ObjectId;
  reset_string: string;
  expiresAt: Date;
}

const passwordResetSchema: Schema<PasswordResetInterface> = new Schema({
  account: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
    required: true,
  },
  reset_string: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now(),
    expires: 60 * 10,
    immutable: true,
  },
});

passwordResetSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed_reset_string = await bcrypt.hash(this.reset_string, salt);
    this.reset_string = hashed_reset_string;
  } catch (error: any) {
    next(error);
  }

  next();
});

const PasswordReset =
  models.PasswordReset || model('PasswordReset', passwordResetSchema);

export default PasswordReset;
