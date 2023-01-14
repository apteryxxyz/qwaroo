import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { Button } from './Button';

export namespace SocialButtons {
    export interface Props {
        className?: string;
        style?: React.CSSProperties;

        disableDiscord?: boolean;
        onDiscordClick?(): void;
    }
}

export function SocialButtons(props: SocialButtons.Props) {
    return <div className="flex flex-row flex-wrap gap-3 text-white font-bold">
        {!props.disableDiscord && <Button
            className={`bg-[#5865F2] ${props.className ?? ''}`}
            whileHover="brightness-125"
            disableDefaultStyles
            iconProp={faDiscord}
            linkProps={{
                href: 'https://discord.gg/C3qVXYqX8J',
                newTab: true,
            }}
        >
            Discord
        </Button>}
    </div>;
}
