'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps extends React.ComponentProps<typeof Image> {
    fallbackSrc: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
    const { src, fallbackSrc, ...rest } = props;
    const [imageSrc, setImageSrc] = useState(src);
    return <Image {...rest} src={imageSrc} onError={() => setImageSrc(fallbackSrc)} />;
}
