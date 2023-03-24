import type { Game, User } from '@qwaroo/server';
import { Scores } from '@qwaroo/server';
import type { User as DiscordUser, Message } from 'discord.js';
import { MapManager } from 'maclary';
import { HigherOrLower } from './HigherOrLower';

type ActiveGame = HigherOrLower;

export class GameManager extends MapManager<string, ActiveGame> {
    public constructor() {
        super();
    }

    public async create(
        game: Game.Document,
        player: User.Document,
        user: DiscordUser,
        message: Message
    ) {
        const instance = new HigherOrLower(game, player, user, message);
        instance.highScore = await this.getHighScore(player, game);
        await instance.prepare().then(() => instance.start());
        this.cache.set(instance.id, instance);
    }

    public async getHighScore(player: User.Document, game: Game.Document) {
        const score = await Scores.getScore(player, game.id).catch(() => null);
        return score?.highScore ?? 0;
    }
}
