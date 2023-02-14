import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { Container } from '../Container';
import { Button } from '../Input/Button';

export function Display(props: Display.Props) {
    return <Container
        parentClassName="flex gap-3 py-[20vh] md:py-[30vh] "
        childClassName="flex flex-col gap-3 mx-auto"
    >
        <section>
            {props.header && <h2 className="text-xl font-semibold text-qwaroo-500">
                {props.header}
            </h2>}

            <h3 className="text-3xl font-bold">{props.title}</h3>

            <p className="max-w-[600px]">{props.description}</p>
        </section>

        <div className="flex flex-wrap gap-1">{props.children}</div>

        {props.showSocials && <div className="flex flex-wrap gap-1">
            <Button
                className="bg-[#5865F2] hover:brightness-125"
                iconProp={faDiscord}
                linkProps={{
                    href: 'https://discord.gg/C3qVXYqX8J',
                    newTab: true,
                }}
            >
                Discord
            </Button>
        </div>}
    </Container>;
}

export namespace Display {
    export interface Props {
        header?: string;
        title: string;
        description: string;

        showSocials?: boolean;

        children?: React.ReactNode | React.ReactNode[];
    }
}
