'use client';

import { useHigherOrLowerSettings as useSettings } from '@/hooks/use-settings';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

export function ImageCroppingSelect(p: { slug: string }) {
  const [{ imageCropping: value }, setSettings] = useSettings(p.slug);
  const setValue = (value: string) =>
    setSettings({ imageCropping: value as never });

  return (
    <div className="space-y-3">
      <Label className="grid-span-1">Image Cropping</Label>

      <Select value={value} onValueChange={setValue}>
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
  );
}
