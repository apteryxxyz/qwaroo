import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { StringTextbox } from './String';

export function NumberTextbox(props: NumberTextbox.Props) {
    const [value, setValue] = props.setValue
        ? [props.value, props.setValue]
        : useState(props.value);

    function onValue(value: string) {
        const number = Number(value);
        if (Number.isNaN(number)) return;
        setValue(number);
    }

    function additionalValidation(value: string) {
        if (props.minValue !== undefined && Number(value) < props.minValue)
            return `Must be at least ${props.minValue}`;
        if (props.maxValue !== undefined && Number(value) > props.maxValue)
            return `Must be at most ${props.maxValue}`;

        return props.additionalValidation?.(value) ?? null;
    }

    return <StringTextbox
        type="number"
        {...props}
        value={String(value)}
        setValue={value => onValue(value as string)}
        additionalValidation={additionalValidation}
    />;
}

export namespace NumberTextbox {
    export interface Props
        extends Omit<
            StringTextbox.Props,
            | 'type'
            | 'minLength'
            | 'maxLength'
            | 'value'
            | 'setValue'
            | 'mustMatch'
        > {
        minValue?: number;
        maxValue?: number;

        value: number;
        setValue?: Dispatch<SetStateAction<number>>;
    }
}
