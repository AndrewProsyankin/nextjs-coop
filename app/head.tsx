// app/head.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Generated by create next app',
  openGraph: {
    title: 'Your App Title',
    description: 'Generated by create next app',
    type: 'website',
    url: 'https://yourwebsite.com',
    images: [
      {
        url: 'https://yourwebsite.com/og-image.jpg',
        width: 800,
        height: 600,
        alt: 'Og Image Alt',
      },
    ],
  },
};
