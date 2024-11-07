import { list } from '@vercel/blob';
import ServvClient from '@/app/servv/page';

export default async function ServvPageServer() {
  const response = await list();

  return (
    <main>
      <ServvClient blobs={response.blobs} />
    </main>
  );
}
