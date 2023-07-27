'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps extends React.ComponentProps<typeof Image> {
  fallbackSrc: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const { src, fallbackSrc, ...rest } = props;
  const [imageSrc, setImageSrc] = useState(src);
  return (
    <Image {...rest} src={imageSrc} onError={() => setImageSrc(fallbackSrc)} />
  );
}
