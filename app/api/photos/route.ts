import { list, put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export interface BlobItem {
  key: string;
  url: string;
}

// GET: Получение списка файлов
export async function GET() {
  try {
    const response = await list();
    const items: BlobItem[] = response.blobs.map((item) => ({
      key: item.pathname,
      url: item.downloadUrl,
    }));

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos from storage' },
      { status: 500 }
    );
  }
}

// POST: Загрузка нового файла
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No file selected' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
    if (imageFile.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds limit' }, { status: 400 });
    }

    const blob = await put(imageFile.name, imageFile, { access: 'public' });
    return NextResponse.json({ message: 'File uploaded successfully', blob }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE: Удаление файла
export async function DELETE(req: Request) {
  try {
    const { key } = await req.json();
    if (!key) {
      return NextResponse.json({ error: 'File key is missing' }, { status: 400 });
    }

    await del([key]);
    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
