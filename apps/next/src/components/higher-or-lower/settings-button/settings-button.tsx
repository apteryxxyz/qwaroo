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
import { ImageCroppingSetting } from './image-cropping';
import { ImageQualitySetting } from './image-quality';

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
          <ImageCroppingSetting slug={p.slug} />
          <ImageQualitySetting slug={p.slug} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
