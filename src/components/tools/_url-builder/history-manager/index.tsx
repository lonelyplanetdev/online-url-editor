'use client';

import { ScrollArea } from '~/components/ui/scroll-area';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';

import { useUrlBuilderStore } from '~/components/tools/url-builder/store';
import { HistoryItem } from './item';
import { ClearHistoryButton } from './clear-button';

export function HistoryManager() {
  const urls = useUrlBuilderStore((state) => state.urls);
  const sorted = urls.sort((a, b) => b.lastEdited - a.lastEdited);

  return (
    <Card className="col-span-1 flex h-full min-h-0 min-w-0 flex-col bg-primary-foreground">
      <CardHeader className="border-b p-3">
        <h2 className="text-md font-bold uppercase">Session History</h2>
      </CardHeader>
      <ScrollArea className="grow">
        <ul className="max-w-full divide-y">
          {!sorted.length && (
            <li className="flex flex-row items-center justify-start p-3">
              <span className="w-full text-center text-primary">
                No history
              </span>
            </li>
          )}
          {sorted.map((url) => (
            <HistoryItem
              item={url}
              key={url.id}
            />
          ))}
        </ul>
      </ScrollArea>
      <CardFooter className="border-t p-3">
        <ClearHistoryButton />
      </CardFooter>
    </Card>
  );
}
