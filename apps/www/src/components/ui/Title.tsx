import React from 'react';
import { cn } from '@/utilities/styling';

const Title = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => <h1
        ref={ref}
        className={cn('text-2xl font-bold leading-none tracking-tight pb-6', className)}
        {...props}
    />
);
Title.displayName = 'Title';

export { Title };
