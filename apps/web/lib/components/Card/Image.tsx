import { useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';

export function ImageCard(props: ImageCard.Props) {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {}, []);

    return <Tilt>
        <picture className="[&>*]:rounded-xl [&>*]:shadow-2xl">
            <img ref={imageRef} {...props} />
        </picture>
    </Tilt>;
}

export namespace ImageCard {
    export interface Props
        extends React.DetailedHTMLProps<
            React.ImgHTMLAttributes<HTMLImageElement>,
            HTMLImageElement
        > {}
}
