import { compress } from '@qwaroo/shared/compress';
import { useGames } from '@qwaroo/sources';
import Content from './content';

export default async function Page() {
  const [games] = await useGames();
  return <Content compressedGames={compress(games)} />;
}
