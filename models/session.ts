import mongoose, { model, models, ObjectId, Schema } from 'mongoose';
import { Document } from 'mongoose';

export interface SessionInterface extends Pick<Document, '_id'> {
  account: mongoose.Types.ObjectId;
  session_id: string;
  expiresAt: Date;
}

const sessionSchema: Schema<SessionInterface> = new Schema(
  {
    account: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account',
      required: true,
    },
    session_id: {
      type: String,
      required: true,
      // default: () => nanoid()
    },
    expiresAt: {
      type: Date,
      // default: () => Date.now(),
      // expires: 60 * 60,
      default: () => Date.now() + 1000 * 60 * 60,
      expires: 0,
      // immutable: true,
    },
    //   TODO: add device and useragent to model..?
  },
  { timestamps: true }
);

const Session = models.Session || model('Session', sessionSchema);

export default Session;
