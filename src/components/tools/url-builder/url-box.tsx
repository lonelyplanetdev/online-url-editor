'use client';

import * as React from 'react';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

interface URLBoxProps {
  url?: string;
  onValidChange?: (value: string) => void;
}
export function URLBox({ url, onValidChange }: URLBoxProps) {
  const [value, setValue] = React.useState(url || '');
  const [error, setError] = React.useState<string | null>(null);

  function handleChange(value: string) {
    if (!value) {
      setError(null);
      setValue(value);
      return onValidChange?.(value);
    }

    try {
      const urlInstance = new URL(value);
      if (urlInstance.protocol !== 'http:' && urlInstance.protocol !== 'https:')
        throw new Error();
      setError(null);
      setValue(value);
    } catch (error) {
      setError('Invalid URL. Please make sure the URL is valid and try again.');
      return setValue(value);
    }

    onValidChange?.(value);
  }

  return (
    <div>
      <div className="grid gap-1.5">
        <Label
          htmlFor="url_builder_url"
          className={error ? 'text-destructive' : ''}
        >
          URL {error ? `- ${error}` : ''}
        </Label>
        <Textarea
          className={error ? 'border-destructive' : ''}
          id="url_builder_url"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}
