// app/PhotoManager/page.tsx
import { GetServerSideProps } from 'next';
import { getPhotos } from './server';

interface Photo {
  key: string;
  url: string;
}

interface PhotoManagerPageProps {
  photos: Photo[];
}

export default function PhotoManagerPage({ photos }: PhotoManagerPageProps) {
  return (
    <div>
      <h1>Photo Manager</h1>
      <div>
        {photos.map((photo) => (
          <div key={photo.key}>
            <img src={photo.url} alt={photo.key} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Получаем фотографии на сервере перед рендерингом
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const photos = await getPhotos();
    return { props: { photos } };
  } catch (error) {
    console.error('Error fetching photos:', error);
    return { props: { photos: [] } };
  }
};
