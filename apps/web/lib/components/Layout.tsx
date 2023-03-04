import { Bubbles } from './Background/Bubbles';
import { Header } from './Header';
import { useResizePageMargin } from '#/hooks/useResizePageMargin';

export function Layout(props: Layout.Props) {
    useResizePageMargin();

    const isLayoutNeeded = props.isLayoutNeeded ?? true;

    return <qwaroo className="min-h-screen flex flex-col mx-auto bg-neutral-200 dark:bg-neutral-900">
        {isLayoutNeeded && <>
            <Header />

            <main
                className="flex flex-col z-[1] gap-3 min-h-screen max-w-8xl w-full mx-auto p-3
                text-black dark:text-white"
            >
                {props.children}
            </main>

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
