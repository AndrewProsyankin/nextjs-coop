'use client';

import Image from 'next/image';

interface Blob {
  pathname: string;
  downloadUrl: string;
}

interface ServvPageProps {
  blobs: Blob[];
}

export default function ServvPage({ blobs }: ServvPageProps) {
  return (
    <div>
      <h1>Photo File Structure</h1>
      <ul className="space-y-4">
        {blobs.map((blob) => (
          <li key={blob.pathname} className="flex items-center space-x-4">
            {blob.pathname.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <Image
                src={blob.downloadUrl}
                alt={blob.pathname}
                width={64}
                height={64}
                className="object-cover w-12 h-12 border rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No Image
              </div>
            )}
            <a href={blob.downloadUrl} className="text-blue-600 hover:underline">
              {blob.pathname}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
