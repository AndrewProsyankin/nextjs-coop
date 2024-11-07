import { list } from '@vercel/blob';
import ServvClient from '@/app/servv/ServvClient';

export default async function ServvPageServer() {
  const response = await list();

  return (
    <main>
      <ServvClient blobs={response.blobs} />
    </main>
  );
}
