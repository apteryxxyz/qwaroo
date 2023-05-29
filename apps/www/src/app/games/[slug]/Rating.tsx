'use client';

import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/Tooltip';

export function RatingBar() {
    return <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div>
                    <Button variant="link" className="pr-1" disabled>
                        <ThumbsUpIcon />
                    </Button>

                    <Button variant="link" className="pl-1" disabled>
                        <ThumbsDownIcon />
                    </Button>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    You must play the game
                    <br />
                    before you can rate it.
                </p>
            </TooltipContent>
        </Tooltip>

        {/* <Tooltip>
                    <div>
                        <Button variant="link" className="pr-1" disabled>
                            <ThumbsUpIcon />
                        </Button>

                        <Button variant="link" className="pl-1" disabled>
                            <ThumbsDownIcon />
                        </Button>
                    </div>
                </Tooltip> */}
    </TooltipProvider>;
}
