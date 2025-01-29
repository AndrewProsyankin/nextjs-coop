'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface Photo {
  key: string;
  url: string;
}
async function fetchPhotos(): Promise<Photo[]> {
  const response = await fetch('/api/photos');
  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }
  const data: Photo[] = await response.json();
  console.log('Fetched photos:', data);
  return data;
}
export default function PhotoManagerPage() {
  const { data: photos, error } = useSWR<Photo[]>('/api/photos', fetchPhotos, {
    onError: (err) => console.error('Error fetching photos:', err),
  });
  
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    setUploading(true);
    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        mutate('/api/photos'); 
      } else {
        const { error } = await response.json();
        alert(error);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (key: string) => {
    setDeleting(key); 
    try {
      const response = await fetch('/api/photos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        const updatedPhotos = await response.json(); 
        mutate('/api/photos', updatedPhotos, false); 
      } else {
        const { error } = await response.json();
        alert(error);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(null); 
    }
  };

  if (error) return <div>Error loading photos</div>;
  if (!photos) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <h1 className="text-center text-gray-800 text-3xl font-bold mb-8">Photo Manager</h1>
      {/* Upload Section */}
      <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12">
        <h2 className="text-center text-gray-700 font-semibold mb-6">Upload a New Photo</h2>
        <div className="flex items-center justify-center">
          {/* Hidden file input */}
          <input
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            id="file-upload"
            className="hidden" // Hiding the default input
          />
          {/* Custom button to trigger file input */}
          <label htmlFor="file-upload" className="px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-all flex items-center justify-center">
            {uploading ? "Uploading..." : "Choose File"}
          </label>
          {/* Optional: Displaying the upload status */}
          {uploading && <p className="ml-4 text-gray-700">Uploading...</p>}
        </div>
      </div>
      {/* Photo List */}
      <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12 space-y-6">
        <h2 className="text-center text-gray-700 font-semibold mb-6">Uploaded Photos</h2>
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo: Photo) => (
              <div key={photo.key} className="flex flex-col items-center bg-white rounded-md shadow-md p-4">
                <img src={photo.url} alt={photo.key} className="w-full h-48 object-cover rounded-md mb-4" />
                <button
                  onClick={() => handleDelete(photo.url)}
                  className={`w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all ${
                    deleting === photo.key ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={deleting === photo.key}
                >
                  {deleting === photo.key ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No photos uploaded yet</p>
        )}
      </div>
    </div>
  );
}