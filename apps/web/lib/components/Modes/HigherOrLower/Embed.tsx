import type { Game, ItemListing, Score } from '@qwaroo/client';
import type { APIGame, APIScore } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import { useEffect, useRef, useState } from 'react';
import { Display } from './Display';
import { Over } from './Over';
import { Overlay } from './Overlay';
import { Settings } from './Settings';
import { Loading } from '#/components/Loading';
import { useClient } from '#/contexts/Client';
import { useLogger } from '#/hooks/useLogger';
import { emitEvent } from '#/utilities/google';
import { sleepSeconds } from '#/utilities/timer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noop = (() => null) as any;

export function Embed(props: Embed.Props) {
    // Variables

    const client = useClient();
    const logger = useLogger(`HigherOrLower(${props.game.slug})`);

    const game = useRef<Game<Embed.Mode>>(null!);
    if (!game.current) game.current = client.games.append(props.game);
    const items = useRef<Embed.Listing>(null!);

    const score = useRef<Score | null>(null);
    if (!score.current && props.score)
        score.current = game.current.scores.append(props.score);

    const startTime = useRef(0);
    const steps = useRef<Embed.Step[]>([]);

    const [status, setStatus] = useState(Embed.Status.Preparing);
    const [highScore, setHighScore] = useState(props.score?.highScore);
    // Internal score is used to keep track of the current item
    const [internalScore, setInternalScore] = useState(0);
    // Display score is used to display the score
    const [displayScore, setDisplayScore] = useState(0);

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<Embed.Settings>({
        imageCropping: 'auto',
        imageQuality: 'reduced',
    });

    // Functions

    async function prepareGame() {
        logger.info('Preparing game...');
        setStatus(Embed.Status.Preparing);

        const listing = await game.current.fetchItems();
        items.current = listing;
    }

    function startGame() {
        logger.info('Starting game...');
        startTime.current = Date.now();
        steps.current = [];
        setStatus(Embed.Status.Waiting);
    }

    function restartGame() {
        logger.info('Restarting game...');
        setStatus(Embed.Status.Preparing);
        setInternalScore(0);
        setDisplayScore(0);
        void prepareGame().then(() => startGame());
    }

    async function endGame() {
        logger.info('Ending game...');
        const endTime = Date.now();

        // Save score
        void game.current.submitScore({
            version: items.current.options.version!,
            seed: items.current.options.seed!,
            steps: steps.current,
            // Time can be modified by the user, but it's not important
            // Prehaps we could send a request when the game starts and count the time from there
            time: Date.now() - startTime.current!,
        });

        // Analytics
        emitEvent('game_end', {
            user_id: client.id ?? 'anonymous',
            user_name: client.me?.displayName ?? 'Anonymous',
            game_id: game.current.id,
            game_title: game.current.title,
            final_score: internalScore,
            final_time: ms(endTime - startTime.current!, { shortFormat: true }),
        });

        setStatus(Embed.Status.Finished);
    }

    function useItem(index: -1 | 0 | 1) {
        return items.current[internalScore + 1 + index];
    }

    async function pickItem(decision: Embed.Step) {
        if (status !== Embed.Status.Waiting)
            return logger.error('Cannot pick item when not waiting');

        const previousItem = useItem(-1);
        const currentItem = useItem(0);

        // Start the number animation
        setStatus(Embed.Status.Picking);
        await sleepSeconds(1);

        if (
            (previousItem.value > currentItem.value && decision === 1) ||
            (previousItem.value < currentItem.value && decision === -1)
        ) {
            logger.info('Wrong guess');
            setStatus(Embed.Status.Wrong);
            await sleepSeconds(1);
            return endGame();
        }

        logger.info('Correct guess');
        setStatus(Embed.Status.Correct);
        steps.current.push(decision);
        await sleepSeconds(1);

        const newScore = internalScore + 1;
        const currentLength = items.current.length;
        const totalLength = items.current.total;
        setDisplayScore(newScore);
        if (highScore && newScore > highScore) setHighScore(newScore);

        if (newScore === totalLength - 1) {
            logger.info('Game finished');
            return endGame();
        }

        setStatus(Embed.Status.Sliding);
        await sleepSeconds(1);
        setStatus(Embed.Status.Waiting);

        setInternalScore(newScore);
        if (currentLength - newScore < 3) {
            // Preload more items
            await items.current.fetchMore();
            logger.info('Fetched more items');
        }
    }

    function mergeSettings(newSettings: Record<string, unknown>) {
        setSettings(s => ({ ...s, ...newSettings }));
    }

    // Hooks

    const settingsKey = `qwaroo.settings_${game.current.id}`;
    useEffect(() => {
        const rawSettings = localStorage.getItem(settingsKey);
        const savedSettings = rawSettings ? JSON.parse(rawSettings) : null;
        if (savedSettings) mergeSettings(savedSettings);

        void prepareGame().then(() => startGame());
    }, []);

    useEffect(() => {
        const rawSettings = JSON.stringify(settings);
        if (rawSettings !== localStorage.getItem(settingsKey))
            localStorage.setItem(settingsKey, rawSettings);
    }, [settings]);

    // Render

    if (status === Embed.Status.Preparing)
        return <div className="fixed inset-0 flex items-center justify-center bg-neutral-200 dark:bg-neutral-900">
            <Loading.Circle />
        </div>;

    if (status === Embed.Status.Finished)
        return <Over score={displayScore} toRestart={restartGame} />;

    return <>
        <Display
            previousItem={useItem(-1)}
            currentItem={useItem(0)}
            nextItem={useItem(1)}
            extraData={game.current.extraData}
            gameSettings={settings}
            itemPicker={props.isPreview ? noop : pickItem}
            isSliding={status === Embed.Status.Sliding}
            isWaiting={status === Embed.Status.Waiting}
        />

        <Overlay
            currentScore={displayScore}
            highScore={highScore}
            isCorrectGuess={status === Embed.Status.Correct}
            isWrongGuess={status === Embed.Status.Wrong}
            toggleSettings={
                props.isPreview ? noop : () => setAreSettingsOpen(true)
            }
            giveUp={props.isPreview ? noop : () => endGame()}
            showGiveUp={!props.isPreview}
            showSettings
        />

        <Settings
            isOpen={areSettingsOpen}
            toClose={() => setAreSettingsOpen(false)}
            settings={settings}
            mergeSettings={mergeSettings}
        />
    </>;
}

export namespace Embed {
    export interface Props {
        game: APIGame;
        score?: APIScore;
        isPreview?: boolean;
    }

    export type Mode = typeof Game.Mode.HigherOrLower;
    export type Listing = ItemListing<Game.Item<Mode>>;
    export type Step = Game.Step<Mode>;

    export interface Settings {
        imageCropping: 'crop' | 'none' | 'auto';
        imageQuality: 'max' | 'reduced';
    }

    export enum Status {
        Preparing = 'initialising',
        Waiting = 'waiting',
        Picking = 'picking',
        Sliding = 'sliding',
        Wrong = 'wrong',
        Correct = 'correct',
        Finished = 'finished',
    }
}
