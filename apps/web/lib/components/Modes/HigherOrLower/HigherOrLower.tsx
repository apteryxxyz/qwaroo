import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faSignIn } from '@fortawesome/free-solid-svg-icons/faSignIn';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Game, ItemListing, Score } from '@qwaroo/client';
import type { APIGame, APIScore } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import { useEffect, useRef, useState } from 'react';
import { GameOver } from './GameOver';
import { ItemBlock } from './ItemBlock';
import { CountUpNumber } from '#/components/Count/Number';
import { Button } from '#/components/Input/Button';
import { Dropdown } from '#/components/Input/Dropdown';
import { Loading } from '#/components/Loading';
import { Modal } from '#/components/Modal';
import { useClient } from '#/contexts/Client';
import { useLogger } from '#/hooks/useLogger';
import { emitEvent } from '#/utilities/googleServices';
import { goFullscreen, goMinimised } from '#/utilities/screenControl';
import { sleepSeconds } from '#/utilities/sleepSeconds';

export function HigherOrLower(props: HigherOrLower.Props) {
    const client = useClient();
    const logger = useLogger(`HigherOrLower(${props.game.slug})`);

    const game = useRef<Game<HigherOrLower.Mode>>(null!);
    if (!game.current) game.current = client.games.append(props.game);
    const score = useRef<Score<Game<HigherOrLower.Mode>>>();
    if (!score.current && props.score)
        score.current = game.current.scores.append(props.score);
    const items = useRef<ItemListing<Game.Item<HigherOrLower.Mode>>>(
        undefined!
    );

    const startTime = useRef(0);
    const steps = useRef<Game.Step<HigherOrLower.Mode>[]>([]);

    const [gameStatus, setGameStatus] =
        useState<HigherOrLower.Status>('loading');
    const [highScore, setHighScore] = useState(score.current?.highScore);
    const [thisScore, setThisScore] = useState(0);

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<HigherOrLower.Settings>({
        imageCropping: 'auto',
        imageQuality: 'reduced',
    });

    async function prepareGame() {
        logger.info('Preparing game');
        setGameStatus('loading');

        const listing = await game.current.fetchItems();
        items.current = listing;
    }

    function restartGame() {
        logger.info('Restarting game');
        setGameStatus('loading');
        setThisScore(0);
        steps.current = [];
        void prepareGame().then(() => startGame());
    }

    function startGame() {
        goFullscreen();
        logger.info('Starting game');
        startTime.current = Date.now();
        setGameStatus('playing');
    }

    async function endGame(finalStatus: 'lose' | 'win') {
        setGameStatus(finalStatus);
        await sleepSeconds(0.7);
        logger.info('Ending game');

        void game.current
            .submitScore({
                version: items.current.options.version!,
                seed: items.current.options.seed!,
                steps: steps.current,
                // Time can be modified by the user, but it's not important
                // Prehaps we could send a request when the game starts and count the time from there
                time: Date.now() - startTime.current!,
            })
            .then(() =>
                emitEvent('game_end', {
                    user_id: client.id ?? 'anonymous',
                    user_name: client.me?.displayName ?? 'Anonymous',
                    game_id: game.current.id,
                    game_title: game.current.title,
                    final_score: score,
                    final_time: ms(Date.now() - startTime.current!, {
                        shortFormat: true,
                    }),
                })
            )
            .catch(() => null);

        await sleepSeconds(0.7);
        setGameStatus('finished');
        goMinimised();
    }

    function useItem(index: -1 | 0 | 1) {
        return items.current[thisScore + 1 + index];
    }

    async function pickItem(decision: Game.Step<HigherOrLower.Mode>) {
        if (gameStatus !== 'playing') return logger.error('Not playing');

        const previousItem = useItem(-1);
        const currentItem = useItem(0);
        logger.info('Picking item', { decision, previousItem, currentItem });

        setGameStatus('animating');
        await sleepSeconds(1);

        if (
            (previousItem.value > currentItem.value && decision === 1) ||
            (previousItem.value < currentItem.value && decision === -1)
        ) {
            logger.info('Wrong guess');
            return endGame('lose');
        }

        steps.current.push(decision);
        logger.info('Correct guess');

        const newScore = thisScore + 1;
        const currentLength = items.current.length;
        const totalLength = items.current.total;

        if (newScore === totalLength - 1) return endGame('win');
        if (currentLength - newScore < 3) {
            // Preload more items
            await items.current.fetchMore();
            logger.info('Fetched more items');
        }

        setGameStatus('next');
        await sleepSeconds(1);
        setGameStatus('playing');

        if (highScore && newScore > highScore)
            setHighScore(s => s && Math.max(s, newScore));
        setThisScore(newScore);
    }

    function mergeSettings(newSettings: Record<string, unknown>) {
        setSettings(s => ({ ...s, ...newSettings }));
    }

    useEffect(() => {
        const settingsKey = `qwaroo.settings_${game.current.id}`;
        const rawSettings = localStorage.getItem(settingsKey);
        if (rawSettings) setSettings(JSON.parse(rawSettings));

        Reflect.set(globalThis, '__ITEM_LISTING__', items);

        void prepareGame().then(() => startGame());
        return () => goMinimised();
    }, []);

    if (gameStatus === 'loading') return <Loading.Circle className="my-auto" />;
    if (gameStatus === 'finished')
        return <GameOver score={thisScore} toRestart={restartGame} />;

    const hasPreview = thisScore < items.current.length - 1;
    const previousItem = useItem(-1);
    const currentItem = useItem(0);
    const nextItem = useItem(1);

    const shouldShowValue = [
        'animating',
        'next',
        'lose',
        'win',
        'finished',
    ].includes(gameStatus);
    const shouldShowActions = gameStatus === 'playing';

    return <>
        {/* Game UI */}
        <div
            className={`flex flex-col xl:flex-row w-screen xl:w-[150vw] h-[150vh] xl:h-screen overflow-hidden
            ${
                gameStatus === 'next' &&
                `translate-x-0 xl:-translate-x-1/3 -translate-y-1/3 xl:translate-y-0
                duration-1000 transition-transform ease-[ease-in-out]`
            }`
                .replaceAll(/\s+/g, ' ')
                .trim()}
        >
            <ItemBlock
                shouldShowValue
                {...previousItem}
                {...game.current.extraData}
                {...settings}
            />

            <ItemBlock
                shouldShowActions={shouldShowActions}
                shouldShowValue={shouldShowValue}
                {...currentItem}
                {...game.current.extraData}
                {...settings}
                value={<CountUpNumber endValue={useItem(0).value} />}
                onMoreClick={() => pickItem(1)}
                onLessClick={() => pickItem(-1)}
            />

            {hasPreview && <ItemBlock
                shouldShowActions
                {...nextItem}
                {...game.current.extraData}
                {...settings}
                onMoreClick={() => pickItem(1)}
                onLessClick={() => pickItem(-1)}
            />}
        </div>

        {/* Buttons */}
        <div className="pointer-events-none fixed inset-0 text-xl text-white align-top">
            <div className="flex flex-row">
                <Button
                    className="!bg-transparent pointer-events-auto"
                    iconProp={faGear}
                    onClick={() => setAreSettingsOpen(true)}
                    ariaLabel="Settings"
                />

                <Button
                    className="!bg-transparent pointer-events-auto"
                    iconProp={faSignIn}
                    onClick={() => endGame('lose')}
                    ariaLabel="Give up"
                />
            </div>
        </div>

        {/* Scores */}
        <div className="pointer-events-none fixed inset-0 flex flex-col mx-3 items-end text-white">
            <span className="flex gap-4 items-center">
                <span className="text-xl">Score</span>
                <span className="text-2xl font-bold">{thisScore}</span>
            </span>

            {highScore !==
                undefined && <span className="flex gap-4 items-center">
                <span className="text-xl">High Score</span>
                <span className="text-2xl font-bold">{highScore}</span>
            </span>}
        </div>

        {/* VS */}
        <div
            className="pointer-events-none fixed inset-0 flex
            items-center justify-center h-[100vh] w-[100vw] text-white"
        >
            <div
                className={`flex items-center justify-center w-12 h-12 lg:w-24 lg:h-24
                rounded-full transition-colors
                ${
                    gameStatus === 'next' || gameStatus === 'win'
                        ? 'bg-green-700'
                        : gameStatus === 'lose'
                        ? 'bg-red-700'
                        : 'bg-slate-800'
                }`}
            >
                <span className="text-2xl lg:text-3xl font-semibold">
                    {gameStatus === 'next' || gameStatus === 'win' ? (
                        <FontAwesomeIcon icon={faCheck} />
                    ) : gameStatus === 'lose' ? (
                        <FontAwesomeIcon icon={faTimes} />
                    ) : (
                        'vs'
                    )}
                </span>
            </div>
        </div>

        <Modal
            title="Game Settings"
            isOpen={areSettingsOpen}
            toClose={() => setAreSettingsOpen(false)}
        >
            <div>
                <span>Image Cropping</span>
                <Dropdown
                    options={[
                        { label: 'Auto', value: 'auto' },
                        { label: 'Crop', value: 'crop' },
                        { label: 'None', value: 'none' },
                    ]}
                    defaultValue={settings.imageCropping}
                    onChange={value => mergeSettings({ imageCropping: value })}
                />
            </div>

            <div>
                <span>Image Quality</span>
                <Dropdown
                    options={[
                        { label: 'Max', value: 'max' },
                        { label: 'Reduced', value: 'reduced' },
                    ]}
                    defaultValue={settings.imageQuality}
                    onChange={value => mergeSettings({ imageQuality: value })}
                />
            </div>
        </Modal>
    </>;
}

export namespace HigherOrLower {
    export interface Props {
        game: APIGame;
        score?: APIScore;
    }

    export interface Settings {
        imageCropping: 'crop' | 'none' | 'auto';
        imageQuality: 'max' | 'reduced';
    }

    export type Status =
        | 'loading'
        | 'playing'
        | 'next'
        | 'animating'
        | 'finished'
        | 'lose'
        | 'win';

    export type Mode = typeof Game.Mode.HigherOrLower;
}
