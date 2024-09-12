import { Document, model, models, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface AccountInterface extends Document {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  email_verified: boolean;
  password: string;
  links: {
    custom_links: any[];
    social_links: any[];
  };
}

const accountSchema: Schema<AccountInterface> = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    links: {
      custom_links: {
        type: Array,
        default: [],
      },
      social_links: {
        type: Array,
        default: [],
      },
    },
  },
  { timestamps: true }
);

accountSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(this.password, salt);
      this.password = hashed_password;
    } catch (error: any) {
      next(error);
    }
  }

  if (!this.isNew && this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(this.password, salt);
      this.password = hashed_password;
    } catch (error: any) {
      next(error);
    }
  }

  next();
});

const Account = models.Account || model('Account', accountSchema);

export default Account;
