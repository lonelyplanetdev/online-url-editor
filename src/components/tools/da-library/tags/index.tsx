'use client';

import { PopoverTrigger } from '@radix-ui/react-popover';
import { EllipsisVertical } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import CreateTag from './create';
import DeleteTag from './delete';
import UpdateTag from './update';
import { Badge } from '~/components/ui/badge';

export default function Tags({ tags }: { tags: { all: string[]; selected: string[] } }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleTag = (tag: string) => {
    const newSelected = tags.selected.includes(tag)
      ? tags.selected.filter((selectedTag) => selectedTag !== tag)
      : [...tags.selected, tag];
    setSelectedTags(newSelected);
  };

  const setSelectedTags = (tags: string[]) => {
    const updatedTags = Array.from(tags).join(',');

    // Create a new search params object
    const params = new URLSearchParams(searchParams.toString());
    if (updatedTags) {
      params.set('tags', updatedTags);
    } else {
      params.delete('tags');
    }

    // Push the new URL with updated query params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex h-10 flex-row items-center justify-between rounded-full border">
      <div className="flex h-full flex-wrap items-center gap-1.5 p-1.5">
        {tags.all.map((tag) => (
          <Badge
            key={tag}
            onClick={() => toggleTag(tag)}
            className={cn('h-full cursor-pointer', tags.selected.includes(tag) ? 'border' : 'bg-primary-foreground/50')}
            variant={tags.selected.includes(tag) ? 'default' : 'outline'}
          >
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-center p-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="size-7 rounded-full p-0 text-xs"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-32 flex-col gap-1.5 p-1.5">
            <CreateTag />
            <UpdateTag tags={tags} />
            <DeleteTag tags={tags} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
