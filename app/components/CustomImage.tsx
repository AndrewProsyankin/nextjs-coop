import dynamic from 'next/dynamic';

const ImageComponent = dynamic(() => import('next/image'), { ssr: false });

interface CustomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, width, height, className }) => {
  return (
    <ImageComponent
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy" 
    />
  );
};

export default CustomImage;
