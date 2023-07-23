import { File, Game, Score } from '@qwaroo/database';
import type { Source } from '@qwaroo/sources';
import { TRPCError } from '@trpc/server';
import _ from 'lodash';
import seedrandom from 'seedrandom';
import { bucket } from '@/services/bucket';

/** Shuffle an array using a seed. */
export function shuffleWithSeed<TItem>(array: TItem[], seed: string): TItem[] {
  const random = seedrandom(seed);
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/** Get the game items from the bucket. */
export async function getGameItems(id: string) {
  const file = await File.Model.findOne({ metadata: { gameId: id } });
  const object = file && (await bucket.readFile(file));
  if (!object)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Game items were not found',
    });
  return JSON.parse(object.toString()) as Source.Item[];
}

/** Helper function for omitting the value from an item. */
export function omitValue(item: Source.Item): Source.PartialItem {
  return _.omit(item, ['value']);
}

/** The state of a game session. */
export interface State {
  id: string;
  time: number;
  values: number[];
  steps: number[];
}

export async function saveScore({ id, steps, time }: State, userId?: string) {
  const game = (await Game.Model.findById(id))!;
  game.totalScore += steps.length;
  game.totalPlays += 1;
  game.totalTime += Date.now() - time;
  game.lastScore = steps.length;
  game.lastTime = Date.now() - time;
  game.lastPlayedAt = new Date();
  if (steps.length > (game.highScore ?? 0)) {
    game.highScore = steps.length;
    game.highScoreTime = Date.now() - time;
    game.highScoreAt = new Date();
  }
  await game.save();

  if (userId) {
    let score = await Score.Model.findOne({ user: userId, game: id });
    if (!score) score = new Score.Model({ user: userId, game: id });

    score.totalScore += steps.length;
    score.totalPlays += 1;
    score.totalTime += Date.now() - time;
    score.lastScore = steps.length;
    score.lastTime = Date.now() - time;
    score.lastPlayedAt = new Date();
    if (steps.length > (score.highScore ?? 0)) {
      score.highScore = steps.length;
      score.highScoreTime = Date.now() - time;
      score.highScoreAt = new Date();
    }
    await score.save();
  }
}
