'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import {
  UrlItem,
  useUrlBuilderStore,
} from '~/components/tools/url-builder/store';

interface HistoryItemProps {
  item: UrlItem;
}
export function HistoryItem({ item }: HistoryItemProps) {
  const { id, base, lastEdited } = item;
  const selected = useUrlBuilderStore((state) => state.selected);
  const setSelected = useUrlBuilderStore((state) => state.setSelected);
  const removeUrl = useUrlBuilderStore((state) => state.removeUrl);

  const isSelected = selected === id;

  function handleSelect() {
    if (!isSelected) setSelected(id);
    else setSelected(null);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    removeUrl(id);
  }

  return (
    <li
      onClick={handleSelect}
      className={cn(
        'group flex w-64 min-w-64 max-w-64 cursor-pointer select-none flex-row items-center justify-start overflow-hidden p-3 hover:bg-background/50',
        {
          'bg-primary/15 hover:bg-primary/25': isSelected,
        },
      )}
    >
      <div className="flex h-8 w-64 flex-row items-center justify-between">
        <div className="w-[calc(256px-24px)] group-hover:w-[calc(256px-54px)]">
          <h3
            className="line-clamp-1 shrink overflow-hidden text-ellipsis whitespace-nowrap text-xs"
            title={base}
          >
            {base}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(lastEdited).toLocaleString()}
          </p>
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="hidden size-8 shrink group-hover:flex"
          onClick={handleRemove}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
