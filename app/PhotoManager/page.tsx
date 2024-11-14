'use server';
import { list, put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

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
    console.log('Starting image conversion...');
    const buffer = await imageFile.arrayBuffer();
    const convertedImage = await sharp(Buffer.from(buffer))
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log('Image conversion successful, starting upload...');
    const blob = await put(imageFile.name.replace(/\.[^.]+$/, '.jpg'), convertedImage, { access: 'public' });
    revalidatePath('/');
    console.log('Image uploaded successfully:', blob.url);
    return blob.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

