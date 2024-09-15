import {} from '@remixicon/react';
import DiscordIcon from './icons/discord';
import FacebookIcon from './icons/facebook';
import InstagramIcon from './icons/instagram';
import LinkIcon from './icons/link';
import LinkedInIcon from './icons/linkedin';
import PinterestIcon from './icons/pinterest';
import RedditIcon from './icons/reddit';
import SnapchatIcon from './icons/snapchat';
import TelegramIcon from './icons/telegram';
import TikTokIcon from './icons/tiktok';
import TumblrIcon from './icons/tumblr';
import TwitchIcon from './icons/twitch';
import XIcon from './icons/x';
import WhatsAppIcon from './icons/whatsapp';
import YouTubeIcon from './icons/youtube';
import { FC } from 'react';

export const emailRegex =
  /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,5})(\.[a-z]{2,5})?$/;

export const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*\W)(?!.* ).{8,16}$/;

export const URLRegex =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

// export const DASHBOARD_NAVIGATION_LINKS = [
// ];

export interface Link {
  name:
    | 'Instagram'
    | 'Facebook'
    | 'X'
    | 'TikTok'
    | 'YouTube'
    | 'LinkedIn'
    | 'Pinterest'
    | 'Snapchat'
    | 'WhatsApp'
    | 'Telegram'
    | 'Reddit'
    | 'Tumblr'
    | 'Twitch'
    | 'Discord'
    | 'Website';
  icon: any;
}

// export interface SocialMediaPlatform {
//   name: string;
//   icon: any;
// }

export const SOCIAL_MEDIA_PLATFORMS: Link[] = [
  {
    name: 'Discord',
    icon: DiscordIcon,
  },
  {
    name: 'Facebook',
    icon: FacebookIcon,
  },
  {
    name: 'Instagram',
    icon: InstagramIcon,
  },
  {
    name: 'Website',
    icon: LinkIcon,
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
  },
  {
    name: 'Pinterest',
    icon: PinterestIcon,
  },
  {
    name: 'Reddit',
    icon: RedditIcon,
  },
  {
    name: 'Snapchat',
    icon: SnapchatIcon,
  },
  {
    name: 'Telegram',
    icon: TelegramIcon,
  },
  {
    name: 'TikTok',
    icon: TikTokIcon,
  },
  {
    name: 'Tumblr',
    icon: TumblrIcon,
  },
  {
    name: 'Twitch',
    icon: TwitchIcon,
  },
  {
    name: 'X',
    icon: XIcon,
  },
  {
    name: 'WhatsApp',
    icon: WhatsAppIcon,
  },
  {
    name: 'YouTube',
    icon: YouTubeIcon,
  },
];
