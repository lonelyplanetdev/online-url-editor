'use client';

import { Check, Clipboard } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export default function CopyButton({ text }: { text: string }) {
  const [copyClicked, setCopyClicked] = useState(false);
  const copyTimeout = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopyClicked(true);
    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current);
    }
    copyTimeout.current = setTimeout(() => {
      setCopyClicked(false);
    }, 1000);
  };
  return (
    <Button
      className={cn(
        'absolute right-0 top-1 size-5 opacity-0 transition-opacity group-hover:opacity-100',
        copyClicked && 'hover:bg-emerald-500/25 hover:text-emerald-500',
      )}
      size="icon"
      variant="ghost"
      onClick={() => {
        copyToClipboard();
      }}
    >
      {copyClicked ? <Check size={12} /> : <Clipboard size={12} />}
    </Button>
  );
}
