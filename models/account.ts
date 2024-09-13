import { Document, model, models, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface Header {
  type: 'header';
  title: string;
}

interface Hyperlink {
  type: 'link';
  title: string;
  href: string;
}

export type CustomLink = Header | Hyperlink;

export interface SocialLink {
  title: string;
  platform: string;
  href: string;
}

export interface AccountInterface extends Document {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  email_verified: boolean;
  password?: string;
  auth_type: 'manual' | 'google';
  profile: {
    title: string;
    bio: string;
    image: string | null;
  };
  links: {
    custom_links: CustomLink[];
    social_links: SocialLink[];
  };
  completed_onboarding: boolean;
  // TODO: add role field..?
  // TODO: add disabled field..?
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
      // required: true,
      required: function () {
        return this.auth_type === 'manual';
      },
      select: false,
    },
    auth_type: {
      type: String,
      required: true,
      enum: ['manual', 'google'],
    },
    profile: {
      title: {
        type: String,
        default: '',
      },
      bio: {
        type: String,
        default: '',
      },
      image: {
        type: String,
        default: null,
      },
    },
    links: {
      // custom_links: {
      //   type: Array,
      //   default: [],
      // },
      // social_links: {
      //   type: Array,
      //   default: [],
      // },
      custom_links: {
        type: [
          {
            type: {
              type: String,
              enum: ['header', 'link'],
            },
            title: {
              type: String,
            },
            href: {
              type: String,
            },
          },
        ],
        default: [],
      },
      social_links: {
        type: [
          {
            title: {
              type: String,
            },
            platform: {
              type: String,
            },
            href: {
              type: String,
            },
          },
        ],
        default: [],
      },
    },
    completed_onboarding: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

accountSchema.pre('save', async function (next) {
  if (this.isNew) {
    if (this.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(this.password, salt);
        this.password = hashed_password;
      } catch (error: any) {
        next(error);
      }
    }
  }

  if (!this.isNew && this.isModified('password')) {
    if (this.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(this.password, salt);
        this.password = hashed_password;
      } catch (error: any) {
        next(error);
      }
    }
  }

  next();
});

const Account = models.Account || model('Account', accountSchema);

export default Account;
