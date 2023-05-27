import { Game } from '@qwaroo/database';
import { GameCard } from '@/components/game/Card';
// import { Badge } from '@/components/ui/Badge';
import { Title } from '@/components/ui/Title';
import database from '@/utilities/database';

export default async function Page() {
    await database;
    // const categories = await Game.getGameCategories();
    const games = await Game.getGames();

    return <section>
        <Title>Games</Title>

        {/* <div className="mb-6 space-x-3">
            {categories.map(category => <Badge key={category}>{category}</Badge>)}
        </div> */}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {games.map(game => <GameCard
                key={game.id}
                game={game}
                creator={'displayName' in game.creator ? game.creator : undefined}
            />)}
        </div>
    </section>;
}
