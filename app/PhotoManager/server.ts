// app/PhotoManager/server.ts
'use server';

import { list } from '@vercel/blob';

interface BlobItem {
  key: string;
  url: string;
}

export async function getPhotos(): Promise<BlobItem[]> {
  const response = await list();
  return response.blobs.map((item: { pathname: string; downloadUrl: string }) => ({
    key: item.pathname,
    url: item.downloadUrl,
  }));
}
