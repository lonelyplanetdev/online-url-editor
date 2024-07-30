'use client';

import { Button } from '~/components/ui/button';
import { useEditorStore } from '~/store/editor';

export function CopyButtons() {
  const includeWWW = useEditorStore((state) => state.includeWWW);
  const editingUrl = useEditorStore((state) => state.editing?.url);

  const copyFullURL = () => {
    if (!editingUrl) return;

    try {
      navigator.clipboard.writeText(editingUrl);
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
    }
  };

  const copyHostname = () => {
    if (!editingUrl) return;

    try {
      const url = new URL(editingUrl);
      if (!includeWWW) url.hostname = url.hostname.replace(/^www\./, '');

      navigator.clipboard.writeText(url.hostname);
    } catch (error) {
      console.error('Failed to copy hostname to clipboard:', error);
    }
  };

  return (
    <div className="flex flex-row-reverse justify-start gap-3">
      <Button
        variant="default"
        size="sm"
        disabled={!editingUrl}
        onClick={copyFullURL}
      >
        Copy Full URL
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={!editingUrl}
        onClick={copyHostname}
      >
        Copy Hostname
      </Button>
    </div>
  );
}
