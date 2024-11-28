'use server';

import { list } from '@vercel/blob';

interface BlobItem {
  key: string;
  url: string;
}

export async function getPhotos(): Promise<BlobItem[]> {
  try {
    const response = await list();
    console.log('Blobs from list:', response.blobs); // Для отладки
    return response.blobs.map((item: { pathname: string; downloadUrl: string }) => ({
      key: item.pathname,
      url: item.downloadUrl,
    }));
  } catch (error) {
    console.error('Error fetching blobs:', error);
    return [];
  }
}
