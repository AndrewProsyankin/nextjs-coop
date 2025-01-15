import React, { useState } from 'react';
import { Photo } from '../interfaces';
import CustomImage from './CustomImage';

interface GalleryImagesProps {
  photos: Photo[];
  onClose: () => void;
  onSelect: (photoUrls: string[]) => void; 
  onDeletePhoto: (key: string) => void;
}

const GalleryImages: React.FC<GalleryImagesProps> = ({ photos, onClose, onSelect, onDeletePhoto }) => {
  const [selectedPhotos, setSelectedPhotos] = useState<{ url: string; index: number }[]>([]);

  const toggleSelectPhoto = (photo: Photo, index: number) => {
    setSelectedPhotos((prev) =>
      prev.find((p) => p.url === photo.url)
        ? prev.filter((p) => p.url !== photo.url)
        : [...prev, { url: photo.url, index }]
    );
  };

  const confirmSelection = () => {
    const photoUrls = selectedPhotos.map((p) => p.url);
    onSelect(photoUrls); 
    setSelectedPhotos([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-xl w-full space-y-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-700">Gallery Images</h2>

        {photos?.length > 0 ? (
          <ul className="grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <li
                key={photo.key}
                className={`cursor-pointer border rounded-md ${
                  selectedPhotos.some((p) => p.url === photo.url) ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => toggleSelectPhoto(photo, index)}
              >
                <div className="relative">
                  <CustomImage
                    image_url={photo.url}
                    alt={photo.key}
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePhoto(photo.key);
                    }}
                    className="absolute top-0 right-0 bg-red-600 text-white text-sm rounded-full p-1 hover:bg-red-700"
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No photos available in the gallery.</p>
        )}

        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={confirmSelection}
            className={`py-2 px-4 rounded-md ${
              selectedPhotos.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={selectedPhotos.length === 0}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryImages;
