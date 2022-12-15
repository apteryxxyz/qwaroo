import type { Game } from '#/models/Game';
import type { Score } from '#/models/Score';

export type APIScore = Score;

export interface APIScoreSave<M extends Game.Mode> {
    seed: string;
    time: number;
    steps: Game.Step<M>[];
}
