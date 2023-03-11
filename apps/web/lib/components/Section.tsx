import { ImageCard } from './Card/Image';

export function Section(props: Section.Props) {
    return <section
        id={props.id}
        className={`
            w-full flex flex-col lg:flex-row items-center justify-center gap-5 mb-10
            ${props.imageSide === 'left' ? 'lg:flex-row-reverse' : ''}
            ${props.className ?? ''}`.replaceAll(/\s+/g, ' ')}
    >
        <div className="w-[40%] p-[5%] flex flex-col items-center justify-center gap-5">
            {props.children}
        </div>

        {props.imageSrc && <ImageCard
            src={props.imageSrc}
            alt={props.imageAlt}
            className="w-full max-h-[40vh]"
        />}
    </section>;
}

export namespace Section {
    export interface Props {
        id?: string;
        className?: string;
        children: React.ReactNode | React.ReactNode[];

        imageSrc?: string;
        imageAlt?: string;
        imageSide?: 'left' | 'right';
    }
}