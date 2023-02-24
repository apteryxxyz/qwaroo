import { Bubbles } from './Background/Bubbles';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout(props: Layout.Props) {
    const isLayoutNeeded = props.isLayoutNeeded ?? true;

    return <qwaroo className="min-h-screen flex flex-col mx-auto bg-neutral-200 dark:bg-neutral-900">
        {isLayoutNeeded && <>
            <Header />

            <main
                className="flex flex-col z-[1] gap-3 max-w-8xl w-full mx-auto p-3
                text-black dark:text-white"
            >
                {props.children}
            </main>

            <Footer />

            <div className="hidden md:block motion-reduce:hidden">
                <Bubbles count={20} />
            </div>
        </>}

        {!isLayoutNeeded && props.children}
    </qwaroo>;
}

export namespace Layout {
    export interface Props extends React.PropsWithChildren {
        isLayoutNeeded?: boolean;
    }
}
