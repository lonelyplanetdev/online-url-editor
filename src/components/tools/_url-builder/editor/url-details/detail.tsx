import * as React from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface UrlDetailProps {
  title: string;
  placeholder: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}
export function UrlDetail({
  onValueChange,
  defaultValue,
  title,
  placeholder,
}: UrlDetailProps) {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={title + placeholder}>{title}</Label>
      <Input
        type="text"
        id={title + placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onValueChange?.(e.target.value);
        }}
      />
    </div>
  );
}
