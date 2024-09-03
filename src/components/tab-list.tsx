'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';
import { ExternalLink } from 'lucide-react';

const NameComp = ({ name, external }: { name: string; external?: boolean }) => {
  return (
    <span className="flex flex-row items-center justify-between">
      {name}
      {external && <ExternalLink size={16} />}
    </span>
  );
};

function TabList({ tabs }: { tabs: { name: string; href: string; disabled: boolean; external?: boolean }[] }) {
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
        <NameComp
          name={tab.name}
          external={tab.external}
        />
      ) : (
        <Link href={tab.href}>
          <NameComp
            name={tab.name}
            external={tab.external}
          />
        </Link>
      )}
    </Button>
  ));
}

export default TabList;
