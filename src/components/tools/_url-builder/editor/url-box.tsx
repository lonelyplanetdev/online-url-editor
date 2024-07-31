'use client';

import * as React from 'react';

import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { useUrlBuilderStore } from '~/components/tools/url-builder/store';

interface UrlBoxProps {
  onInput?: (value: string) => void;
}
export function UrlBox({ onInput }: UrlBoxProps) {
  const urls = useUrlBuilderStore((state) => state.urls);
  const selected = useUrlBuilderStore((state) => state.selected);

  const [urlInput, setUrlInput] = React.useState<string>('');

  React.useEffect(() => {
    if (!selected) return setUrlInput('');
    const selectedUrl = urls.find((url) => url.id === selected);

    if (selectedUrl) setUrlInput(selectedUrl.base);
  }, [selected, urls]);

  return (
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="input_url">Editing URL</Label>
      <Textarea
        id="input_url"
        placeholder="Input URL"
        className="w-full resize-none"
        value={urlInput}
        onChange={(e) => {
          const value = e.target.value;

          if (value) {
            try {
              const urlInstance = new URL(value);
              if (
                urlInstance.protocol !== 'http:' &&
                urlInstance.protocol !== 'https:'
              )
                throw new Error('Invalid URL');

              setUrlInput(value);
              onInput?.(value);
            } catch (error) {
              setUrlInput(value);
            }
          } else onInput?.(value);
        }}
      />
    </div>
  );
}
