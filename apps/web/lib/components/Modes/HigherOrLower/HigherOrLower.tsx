import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faSignIn } from '@fortawesome/free-solid-svg-icons/faSignIn';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Game, ItemManager, ScoreManager } from '@owenii/client';
import { useEffect, useRef, useState } from 'react';
import { ItemBlock } from './ItemBlock';
import { ContentSwapper } from '#/components/ContentSwapper';
import { CountUpNumber } from '#/components/Count/Number';
import { CountUpString } from '#/components/Count/String';
import { Display } from '#/components/Display';
import { Loading } from '#/components/Display/Loading';
import { Button } from '#/components/Input/Button';
import { Dropdown } from '#/components/Input/Dropdown';
import { Modal } from '#/components/Modal';
import { useClient } from '#/contexts/ClientContext';
import { useLogger } from '#/hooks/useLogger';
import {
    disableInspectElement,
    enableInspectElement,
    goFullscreen,
    goMimised,
} from '#/utilities/screenControl';
import { sleepSeconds } from '#/utilities/sleepSeconds';

type Status =
    | 'loading'
    | 'playing'
    | 'next'
    | 'animating'
    | 'finished'
    | 'lose'
    | 'win';

export function HigherOrLower({ game }: HigherOrLower.Props) {
    const client = useClient();
    const logger = useLogger('game:' + game.slug);
    const startTime = useRef<number | null>(null);

    type Item = Game.Entity.Item<HigherOrLower.Mode>;
    const itemsManager = useRef<ItemManager<HigherOrLower.Mode>>(null!);
    const scoresManager = useRef<ScoreManager | null>(null);
    const steps = useRef<HigherOrLower.Step[]>([]);

    const [status, setStatus] = useState<Status>('loading');
    const [items, setItems] = useState<Item[]>([]);

    const [highScore, setHighScore] = useState<number | undefined>();
    const [score, setScore] = useState(0);

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<{ imageFrame?: 'fit' | 'fill' }>(
        {}
    );

    function getItem(index: -1 | 0 | 1) {
        return items[score + 1 + index];
    }

    function prepareGame() {
        logger.info('Preparing game');
        setStatus('loading');
    }

    function startGame() {
        logger.info('Starting game');
        goFullscreen();
        startTime.current = Date.now();
        setStatus('playing');
    }

    async function endGame(final: 'lose' | 'win') {
        setStatus(final);
        await sleepSeconds(1);
        logger.info('Ending game');
        void final;

        if (scoresManager.current) {
            await scoresManager.current.submit(game, {
                seed: itemsManager.current.seed,
                steps: steps.current,
                time: Date.now() - startTime.current!,
            });
        }

        await sleepSeconds(1);
        // goMimised();
        setStatus('finished');
        await sleepSeconds(1);
    }

    async function pickItem(decision: 1 | -1) {
        if (status !== 'playing') {
            logger.error('Not playing');
            return;
        }

        const previousItem = getItem(-1);
        const currentItem = getItem(0);
        logger.info('Picked item', { decision, previousItem, currentItem });
        steps.current.push(decision);

        setStatus('animating');
        await sleepSeconds(1);

        if (
            (previousItem.value > currentItem.value && decision === 1) ||
            (previousItem.value < currentItem.value && decision === -1)
        ) {
            logger.info('Wrong guess');
            return endGame('lose');
        }

        logger.info('Correct guess');

        const newScore = score + 1;
        const currentLength = items.length;
        const totalLength = itemsManager.current.total;
        if (score === totalLength - 1) return endGame('win');

        if (currentLength - newScore < 3) {
            const newItems = await itemsManager.current.fetchMore();
            setItems(items => [...items, ...newItems]);
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
        (async () => {
            disableInspectElement();
            goFullscreen();
            prepareGame();

            const key = `owenii.settings_${game.slug}`;
            const rawSettings = localStorage.getItem(key);
            if (rawSettings) setSettings(JSON.parse(rawSettings));

            itemsManager.current = new ItemManager(game);
            if (client.isLoggedIn()) {
                scoresManager.current = new ScoreManager(client.me);

                await scoresManager.current.fetchAll();
                const score = scoresManager.current //
                    .find(s => s.gameId === game.id);
                if (score) {
                    setHighScore(score.highScore ?? 0);
                    logger.info('Loaded high score', { score });
                }
            }

            await itemsManager.current
                .fetchMore()
                .then(items => setItems(items))
                .then(() => startGame());
        })();

        return () => {
            enableInspectElement();
            goMimised();
        };
    }, []);

    useEffect(() => {
        const rawSettings = JSON.stringify(settings);
        localStorage.setItem(`owenii.settings_${game.slug}`, rawSettings);
    }, [settings]);

    if (items.length === 0) return <Loading />;

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

    return <ContentSwapper
        index={items.length === 0 ? 0 : status === 'finished' ? 2 : 1}
    >
        <Loading />

        <>
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
                    imageFrame={settings.imageFrame ?? previousItem.imageFrame}
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
                    imageFrame={settings.imageFrame ?? currentItem.imageFrame}
                    onMoreClick={() => pickItem(1)}
                    onLessClick={() => pickItem(-1)}
                />

                {hasPreview && nextItem && <ItemBlock
                    thisSide="right"
                    shouldShowActions
                    {...nextItem}
                    {...game.data}
                    imageFrame={settings.imageFrame ?? nextItem.imageFrame}
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
                    <Dropdown
                        label="Item Image Size"
                        options={[
                            { label: 'Unset', value: '' },
                            { label: 'Fill', value: 'fill' },
                            { label: 'Contain', value: 'fit' },
                        ]}
                        defaultOption={settings.imageFrame ?? ''}
                        onChange={v =>
                            setSettings(s => ({
                                ...s,
                                imageFrame: (v || undefined) as
                                    | 'fit'
                                    | 'fill'
                                    | undefined,
                            }))
                        }
                    />
                </div>
            </Modal>
        </>

        <Display
            header="Game Over"
            title={`You scored ${score} points`}
            description="You can play again or browse other games"
            showSocials
        >
            <Button onClick={() => window.location.reload()}>Play again</Button>

            <Button linkProps={{ href: '/games' }}>Browse other games</Button>
        </Display>
    </ContentSwapper>;
}

export namespace HigherOrLower {
    export interface Props {
        game: Game;
    }

    export const Mode = Game.Entity.Mode.HigherOrLower;
    export type Mode = typeof Game.Entity.Mode.HigherOrLower;
    export type Item = Game.Entity.Item<Mode>;
    export type Step = Game.Entity.Step<Mode>;
}