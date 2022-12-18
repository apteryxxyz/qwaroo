import { AnimatePresence, motion } from 'framer-motion';
import { Backdrop } from '../Backdrop';

export namespace Modal {
    export interface Props {
        className?: string;
        isOpen: boolean;
        onClose(): void;
        children: React.ReactNode | React.ReactNode[];
    }
}

export function Modal(props: Modal.Props) {
    return <AnimatePresence initial={false} mode="wait">
        {props.isOpen && <Backdrop onClick={props.onClose}>
            <motion.div
                className={`bg-white text-black dark:bg-neutral-800 dark:text-white
                    rounded-2xl shadow-lg p-5 md:p-10 max-w-[90%] ${props.className}`}
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                {props.children}
            </motion.div>
        </Backdrop>}
    </AnimatePresence>;
}
