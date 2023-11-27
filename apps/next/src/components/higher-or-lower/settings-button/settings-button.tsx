import { SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/sheet';
import { ImageCroppingSelect } from './image-cropping';
import { ImageQualitySelect } from './image-quality';

export function SettingsButton(p: { slug: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-2">
          <SettingsIcon />
          <span className="sr-only">Open Game Settings</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="cursor-auto select-auto">
        <SheetHeader>
          <SheetTitle>Game Settings</SheetTitle>
          <SheetDescription>
            These settings will only be applied to this game.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          <ImageCroppingSelect slug={p.slug} />
          <ImageQualitySelect slug={p.slug} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
