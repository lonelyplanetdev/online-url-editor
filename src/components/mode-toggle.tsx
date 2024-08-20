'use client';

import * as React from 'react';
import { useTheme } from '~/lib/hooks';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export function ModeToggle({ excuseFlex }: { excuseFlex?: boolean }) {
  const [theme, label, nextTheme] = useTheme();

  return (
    <Button
      variant="link"
      className={cn('w-full text-xs', !excuseFlex && 'grow basis-1/3')}
      size="sm"
      onClick={nextTheme}
    >
      {label}
    </Button>
  );
}
