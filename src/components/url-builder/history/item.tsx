'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { useEditorStore } from '~/store/editor';
import { useURLStore } from '~/store/urls';

interface URLBuilderHistoryItemProps {
  id: string;
  url: string;
  unencodedParams: string[];
  timestamp: number;
}
export function URLBuilderHistoryItem({
  id,
  url,
  unencodedParams,
  timestamp,
}: URLBuilderHistoryItemProps) {
  const setSelected = useURLStore((state) => state.setSelected);
  const removeUrl = useURLStore((state) => state.removeUrl);
  const loadItem = useEditorStore((state) => state.loadItem);
  const setParams = useEditorStore((state) => state.setParams);
  const setBlank = useEditorStore((state) => state.setBlank);
  const selected = useURLStore((state) => state.selected);

  const isSelected = selected === id;

  function handleSelect() {
    if (!isSelected) {
      loadItem({ url, id }, unencodedParams);
      setSelected(id);
    } else {
      setBlank();
      setSelected(null);
    }
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
          onClick={handleRemove}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
