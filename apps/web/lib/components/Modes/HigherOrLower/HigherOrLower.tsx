import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faSignIn } from '@fortawesome/free-solid-svg-icons/faSignIn';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//
import { type Game, ItemManager, ScoreManager } from '@qwaroo/client';
import { Game as GameEntity } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import { useEffect, useRef, useState } from 'react';
import { ItemBlock } from './ItemBlock';
import { CountUpNumber } from '#/components/Count/Number';
import { CountUpString } from '#/components/Count/String';
import { Display } from '#/components/Display';
import { Loading } from '#/components/Display/Loading';
import { Button } from '#/components/Input/Button';
import { Dropdown } from '#/components/Input/Dropdown';
import { Modal } from '#/components/Modal';
import { useClient } from '#/contexts/ClientContext';
import { useLogger } from '#/hooks/useLogger';
import { emitEvent } from '#/utilities/googleServices';
import {
    disableInspectElement,
    enableInspectElement,
    goFullscreen,
    goMinimised,
} from '#/utilities/screenControl';
import { sleepSeconds } from '#/utilities/sleepSeconds';

export function HigherOrLower({ slug }: HigherOrLower.Props) {
    const client = useClient();
    const logger = useLogger(`HigherOrLower(${slug})`);

    const startTime = useRef<number | null>(null);
    const itemsManager = useRef<ItemManager<HigherOrLower.Mode>>(null!);
    const scoresManager = useRef<ScoreManager | null>(null);
    const steps = useRef<HigherOrLower.Step[]>([]);

    const [game, setGame] = useState<Game | null>(null);
    const [status, setStatus] = useState<HigherOrLower.Status>('loading');
    const [items, setItems] = useState<HigherOrLower.Item[]>([]);

    const [highScore, setHighScore] = useState<number | undefined>();
    const [score, setScore] = useState(0);

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<HigherOrLower.Settings>({
        imageCropping: 'auto',
        imageQuality: 'reduced',
    });

    function prepareGame() {
        logger.info('Preparing game');
        setStatus('loading');
    }

    function startGame() {
        if (game) {
            logger.info('Starting game');
            goFullscreen();
            startTime.current = Date.now();
            setStatus('playing');
            emitEvent('game_start', {
                user_id: client.id ?? 'anonymous',
                user_name: client.me?.displayName ?? 'Anonymous',
                game_id: game.id,
                game_title: game.title,
            });
        } else {
            logger.error('Game not ready');
        }
    }

    async function endGame(final: 'lose' | 'win') {
        setStatus(final);
        await sleepSeconds(0.7);
        logger.info('Ending game');
        void final;

        if (game) {
            void game
                .submitScore({
                    seed: itemsManager.current.seed,
                    steps: steps.current,
                    // Time can be modified by the user, but it's not important
                    // Prehaps we could send a request when the game starts and count the time from there
                    time: Date.now() - startTime.current!,
                })
                .then(() =>
                    emitEvent('game_end', {
                        user_id: client.id ?? 'anonymous',
                        user_name: client.me?.displayName ?? 'Anonymous',
                        game_id: game.id,
                        game_title: game.title,
                        final_score: score,
                        final_time: ms(Date.now() - startTime.current!, {
                            shortFormat: true,
                        }),
                    })
                )
                .catch(() => null);
        }

        await sleepSeconds(0.7);
        setStatus('finished');
    }

    function getItem(index: -1 | 0 | 1) {
        return items[score + 1 + index];
    }

    async function pickItem(decision: 1 | -1) {
        if (status !== 'playing') {
            logger.error('Not playing');
            return;
        }

        const previousItem = getItem(-1);
        const currentItem = getItem(0);
        logger.info('Picked item', { decision, previousItem, currentItem });

        setStatus('animating');
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

        const newScore = score + 1;
        const currentLength = items.length;
        const totalLength = itemsManager.current.total;
        if (score === totalLength - 1) return endGame('win');

        if (currentLength - newScore < 3) {
            // Preload more items
            const newItems = await itemsManager.current.fetchMore();
            setItems(items => [...items, ...newItems]);
            // TODO: Should probably not log this
            logger.info('Fetched more items', { newItems });
        }

        setStatus('next');
        await sleepSeconds(1);
        setStatus('playing');

        if (highScore !== null && newScore > (highScore ?? 0))
            setHighScore(s => s && Math.max(s, newScore));
        setScore(newScore);
    }

    useEffect(() => {
        disableInspectElement();
        goFullscreen();
        prepareGame();

        const key = `qwaroo.settings_${slug}`;
        const rawSettings = localStorage.getItem(key);
        if (rawSettings) setSettings(JSON.parse(rawSettings));

        void client.games.fetchOne(slug).then(g => setGame(g));

        return () => {
            enableInspectElement();
            goMinimised();
        };
    }, []);

    useEffect(() => {
        if (!game) return;

        itemsManager.current = new ItemManager(game);
        scoresManager.current = client.isLoggedIn()
            ? new ScoreManager(client.me)
            : null;

        (async () => {
            if (client.isLoggedIn() && scoresManager.current) {
                // Fetch the users high score from the database
                await scoresManager.current.fetchAll();
                const score = scoresManager.current //
                    .find(s => s.gameId === game.id);
                setHighScore(score?.highScore ?? 0);
                logger.info('Loaded high score', { score });
            }

            if (itemsManager.current) {
                // Fetch the initial game items
                await itemsManager.current
                    .fetchMore()
                    .then(items => setItems(items))
                    .then(() => startGame());
            }
        })();
    }, [game]);

    useEffect(() => {
        const rawSettings = JSON.stringify(settings);
        localStorage.setItem(`qwaroo.settings_${slug}`, rawSettings);
    }, [settings]);

    // Game is still loading
    if (!game || items.length === 0) return <Loading />;

    // Game has finished
    if (status === 'finished')
        return <Display
            header="Game Over"
            title={`You scored ${score} points.`}
            description="You can play again or browse other games."
            showSocials
        >
            <Button onClick={() => window.location.reload()}>Play again</Button>
            <Button linkProps={{ href: '/games' }}>Browse other games</Button>
        </Display>;

    const hasPreview = score < items.length - 1;
    const previousItem = getItem(-1);
    const currentItem = getItem(0);
    const nextItem = hasPreview && getItem(1);

    const shouldShowValue = [
        'animating',
        'next',
        'lose',
        'win',
        'finished',
    ].includes(status);
    const shouldShowActions = status === 'playing';

    // Game is in play
    return <>
        {/* Game UI */}
        <div
            className={`flex flex-col xl:flex-row w-screen xl:w-[150vw] h-[150vh] xl:h-screen overflow-hidden
        ${
            status === 'next' &&
            'duration-1000 translate-x-0 xl:-translate-x-1/3 -translate-y-1/3 xl:translate-y-0 transition-transform ease-[ease-in-out]'
        }`}
        >
            <ItemBlock
                thisSide="left"
                shouldShowValue
                {...previousItem}
                {...game.data}
                {...settings}
            />

            <ItemBlock
                thisSide="right"
                shouldShowValue={shouldShowValue}
                shouldShowActions={shouldShowActions}
                {...currentItem}
                value={
                    typeof currentItem.value === 'number' ? (
                        <CountUpNumber endValue={currentItem.value} />
                    ) : (
                        <CountUpString endValue={currentItem.value} />
                    )
                }
                {...game.data}
                {...settings}
                onMoreClick={() => pickItem(1)}
                onLessClick={() => pickItem(-1)}
            />

            {hasPreview && nextItem && <ItemBlock
                thisSide="right"
                shouldShowActions
                {...nextItem}
                {...game.data}
                {...settings}
                onMoreClick={() => pickItem(1)}
                onLessClick={() => pickItem(-1)}
            />}
        </div>

        {/* Buttons */}
        <div className="pointer-events-none fixed inset-0 text-xl text-white align-top">
            <div className="flex flex-row">
                <Button
                    disableDefaultStyles
                    className="pointer-events-auto"
                    whileHover="brightness-90"
                    iconProp={faGear}
                    onClick={() => setAreSettingsOpen(true)}
                    ariaLabel="Settings"
                />

                <Button
                    disableDefaultStyles
                    className="pointer-events-auto"
                    whileHover="brightness-90"
                    iconProp={faSignIn}
                    onClick={() => endGame('lose')}
                    ariaLabel="Give up"
                />
            </div>
        </div>

        {/* Scores */}
        <div className="pointer-events-none fixed inset-0 flex flex-col m-3 items-end text-white">
            <span className="flex gap-4 items-center">
                <span className="text-xl">Score</span>
                <span className="text-2xl font-bold">{score}</span>
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
                    status === 'next' || status === 'win'
                        ? 'bg-green-700'
                        : status === 'lose'
                        ? 'bg-red-700'
                        : 'bg-slate-800'
                }`}
            >
                <span className="text-2xl lg:text-3xl font-semibold">
                    {status === 'next' || status === 'win' ? (
                        <FontAwesomeIcon icon={faCheck} />
                    ) : status === 'lose' ? (
                        <FontAwesomeIcon icon={faTimes} />
                    ) : (
                        'vs'
                    )}
                </span>
            </div>
        </div>

        <Modal
            className="flex flex-col gap-3 items-center justify-center"
            isOpen={areSettingsOpen}
            onClose={() => setAreSettingsOpen(false)}
        >
            <h2 className="text-xl font-bold">Game Settings</h2>

            <div className="flex flex-col gap-3">
                <div className="flex flex-col justify-center items-center">
                    <span className="text-lg font-semibold">
                        Image Cropping
                    </span>
                    <Dropdown
                        className="min-w-[200px]"
                        options={[
                            { label: 'Auto', value: 'auto' },
                            { label: 'Crop', value: 'crop' },
                            { label: 'None', value: 'none' },
                        ]}
                        currentValue={settings.imageCropping ?? 'auto'}
                        onChange={v =>
                            setSettings(s => ({
                                ...s,
                                imageCropping:
                                    v as HigherOrLower.Settings['imageCropping'],
                            }))
                        }
                    />

                    <span className="text-lg font-semibold">Image Quality</span>
                    <Dropdown
                        className="min-w-[200px]"
                        options={[
                            { label: 'Max', value: 'max' },
                            { label: 'Reduced', value: 'reduced' },
                        ]}
                        currentValue={settings.imageQuality ?? 'reduced'}
                        onChange={v =>
                            setSettings(s => ({
                                ...s,
                                imageQuality:
                                    v as HigherOrLower.Settings['imageQuality'],
                            }))
                        }
                    />
                </div>
            </div>
        </Modal>
    </>;
}

export namespace HigherOrLower {
    export interface Props {
        slug: string;
    }

    export const Mode = GameEntity.Mode.HigherOrLower;
    export type Mode = typeof GameEntity.Mode.HigherOrLower;
    export type Item = GameEntity.Item<Mode>;
    export type Step = GameEntity.Step<Mode>;

    export interface Settings {
        imageCropping: 'auto' | 'crop' | 'none';
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
}
