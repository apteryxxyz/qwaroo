import type { APIProperty } from '@qwaroo/types';
import { TagTextbox } from '../Input/TagTextbox';
import { Textbox } from '../Input/Textbox';

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
                <TagTextbox
                    className="bg-white dark:!bg-neutral-900"
                    mustMatch={validate}
                    tags={props.value as string[]}
                    setTags={_ => props.onChange(_)}
                />
            ) : (
                <Textbox
                    className="bg-white dark:!bg-neutral-900"
                    mustMatch={validate}
                    value={String(props.value ?? '')}
                    isRequired={props.property.required}
                    setValue={_ => props.onChange(_)}
                />
            );

        case 'number':
            return <Textbox
                className="bg-white dark:!bg-neutral-900"
                mustMatch={/^\d+$/}
                value={String(props.value ?? '')}
                isRequired={props.property.required}
                setValue={_ => props.onChange(_)}
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
        onValidate?(isValid: boolean): void;
    }
}
