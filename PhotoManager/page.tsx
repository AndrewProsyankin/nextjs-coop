// components/PhotoManager.tsx
'use server'
import { list, put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

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

export async function uploadImage(formData: FormData): Promise<string> {
  const imageFile = formData.get('image') as File;
  if (!imageFile) throw new Error('No file selected');

  try {
    const blob = await put(imageFile.name, imageFile, { access: 'public' });
    revalidatePath('/');
    return blob.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
