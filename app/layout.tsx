import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/providers';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'Home - Lynkks',
    template: '%s - Lynkks',
  },
  description:
    'Create your personalized link-in-bio profile and share all your important links in one place. Perfect for social media influencers, content creators, and businesses looking to streamline their online presence.',
  keywords:
    'link in bio, personalized profile, share links, social media links, content creators, online presence, bio links, link sharing tool, single link profile, digital portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </Providers>
    </html>
  );
}
