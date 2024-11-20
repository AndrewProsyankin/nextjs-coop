import React from 'react';
import { Photo } from '../interfaces';
import CustomImage from './CustomImage';

interface PhotoSelectionModalProps {
    photos: Photo[];
    onClose: () => void;
    onSelect: (photoUrl: string) => void;
  }

const PhotoSelectionModal: React.FC<PhotoSelectionModalProps> = ({ photos, onClose, onSelect }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-8 max-w-lg w-full space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Select a Photo</h2>
      <ul className="grid grid-cols-2 gap-4">
        {photos?.map((photo) => (
          <li
            key={photo.key}
            className="cursor-pointer"
            onClick={() => onSelect(photo.url)}
          >
            <CustomImage
              image_url={photo.url}
              alt={photo.key}
              width={100}
              height={100}
              className="object-cover rounded-md border border-gray-300"
            />
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="w-full bg-red-600 text-white py-2 rounded-md">
        Close
      </button>
    </div>
  </div>
);

export default PhotoSelectionModal;
