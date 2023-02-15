import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { Backdrop } from './Backdrop';
import { useOnClickOutside } from '#/hooks/useOnClickOutside';

export function Modal(props: Modal.Props) {
    const modalRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(modalRef, props.toClose);

    return <AnimatePresence mode="wait">
        {props.isOpen && <Backdrop>
            <motion.section
                ref={modalRef}
                className={`bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white
                    grid grid-cols-1 xl:grid-cols-2 gap-4 rounded-2xl shadow-lg p-5 md:p-10 max-w-[90%]
                    ${props.className ?? ''}`
                    .replaceAll(/\s+/g, ' ')
                    .trim()}
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
            >
                <h2 className="text-xl font-bold col-span-full">
                    {props.title}
                </h2>

                {props.children}
            </motion.section>
        </Backdrop>}
    </AnimatePresence>;
}

export namespace Modal {
    export interface Props {
        className?: string;
        title: string;
        isOpen: boolean;
        toClose(): void;
        children: React.ReactNode | React.ReactNode[];
    }
}
