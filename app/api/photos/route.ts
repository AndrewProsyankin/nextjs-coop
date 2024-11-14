import { list, put, del } from '@vercel/blob'; // Ensure `del` is imported for deletion
import { NextResponse } from 'next/server';

export interface BlobItem {
  key: string;
  url: string;
}

// GET function to fetch the list of images
export async function GET() {
  try {
    const response = await list();

    // Ensure that response.blobs is correctly formatted
    if (!response.blobs || response.blobs.length === 0) {
      return NextResponse.json({ message: 'No photos found' }, { status: 404 });
    }

    // Assuming the response contains a `blobs` array
    const items: BlobItem[] = response.blobs.map((item: { pathname: string; downloadUrl: string }) => ({
      key: item.pathname,  // Assuming `pathname` represents the file's key
      url: item.downloadUrl,  // Assuming `downloadUrl` is the public URL
    }));

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: 'Failed to fetch photos from storage.' },
      { status: 500 }
    );
  }
}

// POST function to upload a new file
export async function POST(req: NextResponse) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No file selected' },
        { status: 400 }
      );
    }

    // Optionally add file validation, e.g., check for file size or type

    // Upload the file to blob storage
    const blob = await put(imageFile.name, imageFile, { access: 'public' });

    return NextResponse.json(
      { message: 'File successfully uploaded', blob },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: 'Internal server error during file upload.' },
      { status: 500 }
    );
  }
}

// DELETE function to remove a file
export async function DELETE(req: NextResponse) {
  try {
    const formData = await req.formData();
    const key = formData.get('key') as string;

    if (!key) {
      return NextResponse.json(
        { error: 'No file specified for deletion' },
        { status: 400 }
      );
    }

    // Delete the file from blob storage
    await del([key]);

    return NextResponse.json(
      { message: 'File successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: 'Failed to delete file from storage.' },
      { status: 500 }
    );
  }
}
