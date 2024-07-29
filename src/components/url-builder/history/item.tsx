'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { useURLStore } from '~/store/urls';

interface URLBuilderHistoryItemProps {
  selected?: boolean;
  id: string;
  url: string;
  timestamp: number;
}
export function URLBuilderHistoryItem({
  selected = false,
  id,
  url,
  timestamp,
}: URLBuilderHistoryItemProps) {
  const { setSelected, removeUrl } = useURLStore();

  return (
    <li
      onClick={() => (selected ? setSelected('') : setSelected(id))}
      className={cn(
        'group flex w-64 min-w-64 max-w-64 cursor-pointer select-none flex-row items-center justify-start overflow-hidden p-3 hover:bg-background/50',
        {
          'bg-primary/15 hover:bg-primary/25': selected,
        },
      )}
    >
      <div className="flex h-10 w-64 flex-row items-center justify-between">
        <div className="w-[calc(256px-24px)] group-hover:w-[calc(256px-76px)]">
          <h3
            className="line-clamp-1 shrink overflow-hidden text-ellipsis whitespace-nowrap text-xs"
            title={url}
          >
            {url}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="hidden size-8 shrink group-hover:flex"
          onClick={(e) => {
            e.stopPropagation();
            removeUrl(id);
          }}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
