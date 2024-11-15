'use client'
import Image from 'next/image';

interface CustomImageProps {
  image_url: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ image_url, alt, width, height, className }) => {
  return (
    <div className="relative" style={{ width: width || '100%', height: height || 'auto' }}>
      <Image
        src={image_url || '/path/to/placeholder-image.jpg'} 
        alt={alt}
        width={width}
        height={height}
        className={`object-cover ${className}`}
        loading="lazy"
      />
    </div>
  );
};

export default CustomImage;
