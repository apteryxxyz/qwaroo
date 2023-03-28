export function Field(props: Field.Props) {
    return <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex flex-col lg:w-[30%] pr-10">
            <label className="text-lg">{props.label}</label>
            {props.description && <small className="opacity-80">
                {props.description}
            </small>}
        </div>

        <div className="flex-grow">{props.children}</div>
    </div>;
}

export namespace Field {
    export interface Props {
        label: string;
        description?: string;
        children: React.ReactNode;
    }
}
