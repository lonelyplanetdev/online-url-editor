'use client';

import * as React from 'react';
import { Button } from '~/components/ui/button';
import { useUrlBuilderStore } from '~/components/tools/url-builder/store';

export function ClearHistoryButton() {
  const clearUrls = useUrlBuilderStore((state) => state.clearUrls);
  const [confirming, setConfirming] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);

  return confirming ? (
    <div className="flex w-full flex-row gap-3">
      <Button
        variant="destructive"
        size="sm"
        className="basis-1/2"
        onClick={() => {
          clearUrls();
          setConfirming(false);
          setMessage('History Cleared');
          setTimeout(() => setMessage(null), 500);
        }}
      >
        Confirm
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="basis-1/2"
        onClick={() => setConfirming(false)}
      >
        Cancel
      </Button>
    </div>
  ) : (
    <Button
      variant={message ? 'secondary' : 'destructive'}
      size="sm"
      className="w-full"
      onClick={() => !message && setConfirming(true)}
    >
      {message || 'Clear History'}
    </Button>
  );
}
