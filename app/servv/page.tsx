'use client'
import { list } from '@vercel/blob';
 
export default async function ServvPage() {
  const response = await list();
  
  return (
    <div>
      <h1>Photo File Structure</h1>
      <ul className="space-y-4">
        {response.blobs.map((blob) => (
            <li key={blob.pathname} className="flex items-center space-x-4">
              {blob.pathname.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img 
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


