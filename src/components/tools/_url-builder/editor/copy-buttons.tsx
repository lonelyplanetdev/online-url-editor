'use client';

import * as React from 'react';

import { Button } from '~/components/ui/button';
import { useUrlBuilderStore } from '~/components/tools/url-builder/store';

export function CopyButtons() {
  const selected = useUrlBuilderStore((state) => state.selected);
  const urls = useUrlBuilderStore((state) => state.urls);
  const outputUrl = urls.find((url) => url.id === selected)?.base;

  const copyFullURL = () => {
    if (!selected || !outputUrl) return;

    try {
      navigator.clipboard.writeText(outputUrl);
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
    }
  };

  const copyHostname = () => {
    if (!selected || !outputUrl) return;

    try {
      const url = new URL(outputUrl);

      navigator.clipboard.writeText(url.hostname);
    } catch (error) {
      console.error('Failed to copy hostname to clipboard:', error);
    }
  };

  return (
    <div className="flex w-full items-center justify-end">
      <div className="flex flex-row-reverse justify-start gap-3">
        <Button
          variant="default"
          disabled={!selected || !outputUrl}
          onClick={copyFullURL}
        >
          Copy Full URL
        </Button>
        <Button
          variant="secondary"
          disabled={!selected || !outputUrl}
          onClick={copyHostname}
        >
          Copy Hostname
        </Button>
      </div>
    </div>
  );
}
