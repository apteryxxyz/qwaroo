'use client';

import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useSettings } from '../hooks';

export function ImageQualitySetting(p: { slug: string }) {
  const [{ imageQuality: value }, setSettings] = useSettings(p.slug);
  const setValue = (value: string) =>
    setSettings({ imageQuality: value as never });

  return (
    <div className="space-y-3">
      <Label>
        Image Quality
        <br />
        <span className="font-normal text-muted-foreground">
          Reduced will make the game load faster and use less data at the cost
          of image quality.
        </span>
      </Label>

      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select a quality" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="reduced">Reduced</SelectItem>
          <SelectItem value="max">Max</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
