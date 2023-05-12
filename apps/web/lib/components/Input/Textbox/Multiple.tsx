import { faRemove } from '@fortawesome/free-solid-svg-icons/faRemove';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { StringTextbox } from './String';

export function MultipleTextbox(props: MultipleTextbox.Props) {
    const [input, setInput] = useState('');
    const [childError, setChildError] = useState<string | null>(null);

    const [values, setValues] = props.setValues
        ? [props.values ?? [], props.setValues]
        : useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    function onChange(key: string, value: string) {
        if (key !== 'Enter' || !value.trim()) return;
        if (props.maxCount && values.length >= props.maxCount) return;
        if (childError) return;

        const newValues = [...values, value] //
            .filter((v, i, a) => a.indexOf(v) === i && v.trim().length > 0);

        setValues(newValues);
        setInput('');
    }

    function removeValue(value: string) {
        const newValues = values.filter(v => v !== value);
        setValues(newValues);
        setInput(input => input);
    }

    function validate() {
        if (props.minCount && values.length < props.minCount)
            return `Must have at least ${props.minCount} value${
                props.minCount === 1 ? '' : 's'
            }`;
        if (props.maxCount && values.length > props.maxCount)
            return `Must have at most ${props.maxCount} value${
                props.maxCount === 1 ? '' : 's'
            }`;

        return null;
    }

    useEffect(() => {
        const result = validate();
        setError(result);
        props.onValidate?.(result);
    }, [values.join(',')]);

    return <div className="flex flex-col gap-2">
        <StringTextbox
            {...props}
            value={input}
            setValue={setInput}
            isDisabled={values.length >= (props.maxCount ?? 10)}
            onKeyUp={onChange}
            onBlur={() => onChange('Enter', input)}
            isRequired={false}
            onValidate={error => setChildError(error)}
        />

        <div className="flex flex-row gap-3 mx-1">
            {values.map(value => <div
                key={value}
                className={`bg-white dark:bg-neutral-700 rounded-xl p-2
                    ${props.className ?? ''}`}
            >
                {value}

                <button className="ml-2" onClick={() => removeValue(value)}>
                    <FontAwesomeIcon icon={faRemove} />
                </button>
            </div>)}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    </div>;
}

export namespace MultipleTextbox {
    export interface Props
        extends Omit<StringTextbox.Props, 'value' | 'setValue'> {
        values?: string[];
        setValues?: Dispatch<SetStateAction<string[]>>;

        minCount?: number;
        maxCount?: number;
    }
}
