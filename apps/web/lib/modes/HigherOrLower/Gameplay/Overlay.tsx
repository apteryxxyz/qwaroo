import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faSignIn } from '@fortawesome/free-solid-svg-icons/faSignIn';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { Button } from '#/components/Input/Button';

export function Overlay(props: Overlay.Props) {
    return <>
        <div className="fixed left-0 right-0 top-0 flex flex-row w-full justify-between">
            {/* Buttons */}
            <div className="flex flex-col">
                {props.showSettings && <Button
                    className="!bg-transparent !text-xl"
                    iconProp={faGear}
                    ariaLabel="Open settings"
                    onClick={props.toggleSettings}
                />}

                {props.showGiveUp && <Button
                    className="!bg-transparent !text-xl"
                    iconProp={faSignIn}
                    ariaLabel="Give up"
                    onClick={props.giveUp}
                />}
            </div>

            {/* Scores */}
            <div className="pointer-events-none select-none flex flex-col items-end text-white pr-2">
                {(props.highScore ?? 0) > 0 && <span className="text-xl">
                    High Score{' '}
                    <span className="text-2xl font-bold">
                        {props.highScore}
                    </span>
                </span>}

                {(props.currentScore || true) && <span className="text-xl">
                    Score{' '}
                    <span className="text-2xl font-bold">
                        {props.currentScore}
                    </span>
                </span>}
            </div>
        </div>

        {/* VS */}
        <div className="pointer-events-none select-none fixed inset-0 w-screen h-screen flex items-center justify-center text-white">
            <motion.div
                className="flex items-center justify-center rounded-full w-12 h-12 xl:w-24 xl:h-24"
                animate={{
                    backgroundColor: props.isCorrectGuess
                        ? '#34D399'
                        : props.isWrongGuess
                        ? '#EF4444'
                        : '#15181c',
                }}
            >
                <span className="text-2xl lg:text-3xl font-bold">
                    {props.isCorrectGuess ? (
                        <FontAwesomeIcon icon={faCheck} />
                    ) : props.isWrongGuess ? (
                        <FontAwesomeIcon icon={faTimes} />
                    ) : (
                        'VS'
                    )}
                </span>
            </motion.div>
        </div>
    </>;
}

export namespace Overlay {
    export interface Props {
        currentScore?: number;
        highScore?: number;

        showSettings?: boolean;
        toggleSettings(): void;

        showGiveUp?: boolean;
        giveUp(): void;

        isCorrectGuess: boolean;
        isWrongGuess: boolean;
    }
}
