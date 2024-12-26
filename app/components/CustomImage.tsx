'use client';
import Image from 'next/image';

interface CustomImageProps {
  image_url: string | null; 
  alt: string; 
  width: number; 
  height: number; 
  className?: string; 
}

const CustomImage: React.FC<CustomImageProps> = ({ image_url, alt, width, height, className }) => {
  const isImageValid = image_url && image_url.startsWith('http'); 

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: width || '100%', height: height || 'auto' }}
    >
      {isImageValid ? (
        <Image
          src={image_url} 
          alt={alt}
          width={width}
          height={height}
          className={`object-cover ${className}`}
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full bg-gray-300 flex items-center justify-center text-white font-bold ${className}`}
        >
          ?
        </div>
      )}
    </div>
  );
};

export default CustomImage;
