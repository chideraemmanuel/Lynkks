import { SOCIAL_MEDIA_PLATFORMS } from '@/constants';

const getIconByPlatform = (
  social_platform:
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
    | 'Website'
) => {
  const res = SOCIAL_MEDIA_PLATFORMS.find((platform) => {
    return platform.name === social_platform;
  });

  return res?.icon;
};

export default getIconByPlatform;
