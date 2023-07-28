import { Activity, File, Game } from '@qwaroo/database';
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
export async function getGameItemsById(id: string) {
  const file = await File.Model.findOne({ metadata: { gameId: id } });
  const object = file && (await bucket.readFile(file));
  if (!object)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Game items were not found',
    });
  return [file.hash, JSON.parse(object.toString()) as Source.Item[]] as const;
}

/** Get the game items from the bucket. */
export async function getGameItemsByHash(hash: string) {
  const object = await bucket.readFile(hash);
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
  gameId: string;
  startTime: number;
  itemValues: number[];
  stepsTaken: number[];
  objectHash: string;
}

export async function saveScore(
  { gameId, stepsTaken, startTime }: State,
  userId?: string,
) {
  const game = (await Game.Model.findById(gameId))!;
  game.score.totalScore += stepsTaken.length;
  game.score.totalPlays += 1;
  game.score.totalTime += Date.now() - startTime;
  game.score.lastScore = stepsTaken.length;
  game.score.lastTime = Date.now() - startTime;
  game.score.lastPlayedAt = new Date();
  if (stepsTaken.length > (game.score.highScore ?? 0)) {
    game.score.highScore = stepsTaken.length;
    game.score.highScoreTime = Date.now() - startTime;
    game.score.highScoreAt = new Date();
  }
  await game.save();

  if (userId) {
    let activity = await Activity.Model.findOne({ user: userId, game: gameId });
    if (!activity)
      activity = new Activity.Model({
        user: userId,
        game: gameId,
      });

    activity.score.totalScore += stepsTaken.length;
    activity.score.totalPlays += 1;
    activity.score.totalTime += Date.now() - startTime;
    activity.score.lastScore = stepsTaken.length;
    activity.score.lastTime = Date.now() - startTime;
    activity.score.lastPlayedAt = new Date();
    if (stepsTaken.length > (activity.score.highScore ?? 0)) {
      activity.score.highScore = stepsTaken.length;
      activity.score.highScoreTime = Date.now() - startTime;
      activity.score.highScoreAt = new Date();
    }
    await activity.save();
  }
}
