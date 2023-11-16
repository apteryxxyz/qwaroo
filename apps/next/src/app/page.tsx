import { compress } from '@qwaroo/shared/compress';
import { useGames } from '@qwaroo/sources';
import HomeContent from './content';

export default async function HomePage() {
  const [games] = await useGames();
  return <HomeContent compressedGames={compress(games)} />;
}
