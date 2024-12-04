'use server';

import { list, del } from '@vercel/blob';

interface BlobItem {
  key: string;
  url: string;
}

/**
 * Получает список фотографий из хранилища.
 */
export async function getPhotos(): Promise<BlobItem[]> {
  try {
    const response = await list();
    console.log('Blobs from list:', response.blobs);
    return response.blobs.map((item: { pathname: string; downloadUrl: string }) => ({
      key: item.pathname,
      url: item.downloadUrl,
    }));
  } catch (error) {
    console.error('Error fetching blobs:', error);
    return [];
  }
}

/**
 * Удаляет фотографию из хранилища по ключу.
 * @param key - Ключ удаляемого файла.
 */
export async function deletePhoto(key: string): Promise<boolean> {
  try {
    console.log(`Attempting to delete key: ${key}`);
    await del(key);
    console.log(`Successfully deleted key: ${key}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete key: ${key}`, error);
    return false;
  }
}

