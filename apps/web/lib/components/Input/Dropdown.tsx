import { useEffect, useState } from 'react';

export namespace Dropdown {
    export interface Props {
        className?: string;

        label: string;
        options: { label: string; value: string }[] | string[];
        defaultOption?: string;
        isDisabled?: boolean;

        onChange?(value: string): void;
    }
}

export function Dropdown(props: Dropdown.Props) {
    const [id, setId] = useState('');

    const options = props.options.map(option => {
        if (typeof option === 'string') return { label: option, value: option };
        else return option;
    });

    useEffect(() => {
        setId(`dropdown-${Math.random().toString(36).slice(2, 11)}`);
    }, []);

    return <div className="flex flex-col gap-3 text-lg font-semibold">
        <label htmlFor={id} className="text-lg font-semibold">
            {props.label}
        </label>

        <select
            className="p-2 rounded-md border-2 border-gray-300 cursor-pointer"
            disabled={props.isDisabled}
            id={id}
            defaultValue={props.defaultOption}
            onChange={e => {
                console.log(e.target.value);
                props.onChange?.(e.target.value);
            }}
        >
            {options.map(opt => <option
                key={opt.value}
                className="cursor-pointer"
                value={opt.value}
            >
                {opt.label}
            </option>)}
        </select>
    </div>;
}
