import Image from 'next/image';

interface CustomImageProps {
  image_url: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ image_url, alt, width, height, className }) => {
  if (!image_url) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>;
  }

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}>
      <Image
        src={image_url}
        alt={alt}
        layout="fill"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        className={className}
        loading="lazy"
      />
    </div>
  );
};

export default CustomImage;
