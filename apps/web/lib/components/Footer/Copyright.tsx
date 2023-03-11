export function Copyright(props: Copyright.Props) {
    const copyright: string[] = [];
    copyright.push(`© ${new Date().getFullYear()} Apteryx Software`);
    if (props.includeDiscord)
        copyright.push('Not affiliated with Discord Inc.');

    return <span className="flex flex-row gap-3 justify-center text-sm">
        {copyright.join(' • ')}
    </span>;
}

export namespace Copyright {
    export interface Props {
        includeDiscord?: boolean;
    }
}
