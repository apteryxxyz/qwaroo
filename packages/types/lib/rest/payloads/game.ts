import type { Game } from '#/models/Game';

export type APIGame<M extends Game.Mode = Game.Mode> = Game<M>;

export type APIGameItem<M extends Game.Mode = Game.Mode> = Game.Item<M>;
