'use client';

import * as React from 'react';
import { Button } from '~/components/ui/button';
import { useURLStore } from '~/store/urls';

export function URLBuilderHistoryClearButton() {
  const { wipeUrls } = useURLStore();
  const [confirming, setConfirming] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);

  return confirming ? (
    <div className="flex w-full flex-row gap-3">
      <Button
        variant="destructive"
        size="sm"
        className="basis-1/2"
        onClick={() => {
          wipeUrls();
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
      variant="destructive"
      size="sm"
      className="w-full"
      disabled={message !== null}
      onClick={() => setConfirming(true)}
    >
      {message || 'Clear History'}
    </Button>
  );

  // return (
  //   <Button
  //     variant="destructive"
  //     size="sm"
  //     className="w-full"
  //   >
  //     Clear History
  //   </Button>
  // );
}
