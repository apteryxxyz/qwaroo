import { motion } from 'framer-motion';

export function Backdrop(props: Backdrop.Props) {
    return <motion.div
        className="fixed top-0 left-0 h-screen w-screen bg-black/50
            flex items-center justify-center"
        onClick={props.onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        {props.children}
    </motion.div>;
}

export namespace Backdrop {
    export interface Props {
        children: React.ReactNode | React.ReactNode[];
        onClick?(): void;
    }
}
