import type { APIProperty } from '@qwaroo/types';
import { MultipleTextbox } from '../Input/Textbox/Multiple';
import { NumberTextbox } from '../Input/Textbox/Number';
import { StringTextbox } from '../Input/Textbox/String';

export function Property(props: Property.Props) {
    const isArray = Array.isArray(props.property.type);
    const type = Array.isArray(props.property.type)
        ? props.property.type[0]
        : props.property.type;
    const validate = props.property.validate
        ? new RegExp(props.property.validate.slice(1, -1))
        : undefined;

    switch (type) {
        case 'string':
            return isArray ? (
                <MultipleTextbox
                    mustMatch={validate}
                    minCount={props.property.minCount}
                    maxCount={props.property.maxCount}
                    minLength={props.property.minLength}
                    maxLength={props.property.maxLength}
                    values={props.value as string[]}
                    setValues={props.onChange}
                    onValidate={props.onValidate}
                />
            ) : (
                <StringTextbox
                    mustMatch={validate}
                    minLength={props.property.minLength}
                    maxLength={props.property.maxLength}
                    value={String(props.value ?? '')}
                    setValue={props.onChange}
                    onValidate={props.onValidate}
                />
            );

        case 'number':
            return <NumberTextbox
                minValue={props.property.minValue}
                maxValue={props.property.maxValue}
                value={Number(props.value ?? '')}
                setValue={props.onChange}
                onValidate={props.onValidate}
            />;

        default:
            return null;
    }
}

export namespace Property {
    export interface Props {
        property: APIProperty;
        value: unknown;
        onChange(value: unknown): void;
        onValidate?(error: string | null): void;
    }
}
