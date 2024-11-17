'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface Photo {
  key: string;
  url: string;
}

async function fetchPhotos() {
  const response = await fetch('/api/photos');
  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }
  return response.json();
}

export default function PhotoManagerPage() {
  const { data: photos, error } = useSWR<Photo[]>('/api/photos', fetchPhotos);
  const [uploading, setUploading] = useState(false);

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
        mutate('/api/photos'); // Обновляем данные после загрузки
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
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch('/api/photos', {
        method: 'DELETE',
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        mutate('/api/photos'); // Обновляем данные после удаления
      } else {
        const { error } = await response.json();
        alert(error);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (error) return <div>Error loading photos</div>;
  if (!photos) return <div>Loading...</div>;

  return (
    <div>
      <h1>Photo Manager</h1>
      <div>
        <input type="file" onChange={handleUpload} disabled={uploading} />
        {uploading && <p>Uploading...</p>}
      </div>
      <div>
        {photos.map((photo) => (
          <div key={photo.key} style={{ marginBottom: '10px' }}>
            <img src={photo.url} alt={photo.key} style={{ maxWidth: '200px' }} />
            <button onClick={() => handleDelete(photo.key)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
