import type { Game } from '@qwaroo/client';
import { Block } from './Block';
import type { Embed } from './Embed';
import { CountUpNumber } from '#/components/Count/Number';

export function Display(props: Display.Props) {
    return <div
        className={`fixed flex flex-col overflow-hidden
        w-screen h-[150vh] xl:flex-row xl:h-screen xl:w-[150vw]
        ${
            props.isSliding &&
            `translate-x-0 xl:-translate-x-1/3 -translate-y-1/3 xl:translate-y-0
            duration-1000 transition-transform ease-[ease-in-out]`
        }`}
    >
        <Block
            showValue
            {...props.previousItem}
            {...props.extraData}
            {...props.gameSettings}
        />

        <Block
            showValue={!props.isWaiting}
            showActions={props.isWaiting}
            {...props.currentItem}
            {...props.extraData}
            {...props.gameSettings}
            value={<CountUpNumber endValue={props.currentItem.value} />}
            onHigherClick={() => props.itemPicker(1)}
            onLowerClick={() => props.itemPicker(-1)}
        />

        {props.nextItem && <Block
            showActions
            {...props.nextItem}
            {...props.extraData}
            {...props.gameSettings}
            onHigherClick={() => props.itemPicker(1)}
            onLowerClick={() => props.itemPicker(-1)}
        />}
    </div>;
}

export namespace Display {
    export interface Props {
        previousItem: Game.Item<Embed.Mode>;
        currentItem: Game.Item<Embed.Mode>;
        nextItem?: Game.Item<Embed.Mode>;

        extraData: Game.Extra;
        gameSettings: Embed.Settings;

        itemPicker(index: 1 | -1): Promise<void>;

        isWaiting: boolean;
        isSliding: boolean;
    }
}
