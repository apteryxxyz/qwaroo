import { compress } from '@qwaroo/shared/compress';
import { useGames } from '@qwaroo/sources';
import { absoluteUrl } from '@/utilities/url';
import { generateMetadata } from '../metadata';
import ProfileContent from './content';

export const metadata = generateMetadata({
  title: 'Your Profile',
  description: 'View your profile and statistics for Qwaroo games.',
  openGraph: { url: absoluteUrl('/profile') },
});

export default async function ProfilePage() {
  const [games] = await useGames();
  return <ProfileContent compressedGames={compress(games)} />;
}
