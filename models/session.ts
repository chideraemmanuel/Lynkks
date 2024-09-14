import mongoose, { model, models, ObjectId, Schema } from 'mongoose';
import { Document } from 'mongoose';

export interface SessionInterface extends Document {
  account: ObjectId;
  session_id: string;
  lastAccessed: Date;
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
    lastAccessed: {
      type: Date,
      default: () => Date.now(),
      expires: 60 * 60,
      immutable: true,
    },
    //   device/useragent
  },
  { timestamps: true }
);

const Session = models.Session || model('Session', sessionSchema);

export default Session;
