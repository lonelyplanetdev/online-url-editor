'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';

function TabList({
  tabs,
}: {
  tabs: { name: string; href: string; disabled: boolean }[];
}) {
  const pathName = usePathname();
  const isActive = (href: string) => {
    return pathName === href;
  };

  return tabs.map((tab) => (
    <Button
      key={tab.name}
      variant="ghost"
      className={cn(
        'w-full select-none justify-start font-light',
        isActive(tab.href) && 'bg-primary-foreground font-semibold',
        tab.disabled && 'cursor-not-allowed text-muted-foreground',
      )}
      size="sm"
      asChild
      disabled={tab.disabled}
    >
      {tab.disabled ? (
        <span>{tab.name}</span>
      ) : (
        <Link href={tab.href}>{tab.name}</Link>
      )}
    </Button>
  ));
}

export default TabList;
