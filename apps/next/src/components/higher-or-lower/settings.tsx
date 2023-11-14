'use client';

import { useLocalStorage } from '@mantine/hooks';
import { SettingsIcon } from 'lucide-react';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

export type SettingsState = {
  imageQuality: 'max' | 'reduced';
  imageCropping: 'none' | 'crop' | 'auto';
};

export function useSettings(slug: string) {
  return useLocalStorage<SettingsState>({
    key: `${slug}.settings`,
    defaultValue: { imageCropping: 'auto', imageQuality: 'reduced' },
  });
}

export function Settings(p: { slug: string }) {
  const [settings, setSettings] = useSettings(p.slug);
  const setSetting = <T extends keyof SettingsState>(
    key: T,
    value: string | SettingsState[T],
  ) => setSettings({ ...settings, [key]: value });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <SettingsIcon className="hover:cursor-pointer">
          <span className="sr-only">Open Game Settings</span>
        </SettingsIcon>
      </SheetTrigger>

      <SheetContent side="left" className="cursor-auto select-auto">
        <SheetHeader>
          <SheetTitle>Game Settings</SheetTitle>
          <SheetDescription>
            These settings will only be applied to this game.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-3">
            <Label className="grid-span-1">Image Cropping</Label>
            <Select
              value={settings.imageCropping}
              onValueChange={(v) => setSetting('imageCropping', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a cropping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="crop">Crop</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>
              Image Quality
              <br />
              <span className="font-normal text-muted-foreground">
                Reduced will make the game load faster and use less data at the
                cost of image quality.
              </span>
            </Label>
            <Select
              defaultValue={settings.imageQuality}
              onValueChange={(v) => setSetting('imageQuality', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reduced">Reduced</SelectItem>
                <SelectItem value="max">Max</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
