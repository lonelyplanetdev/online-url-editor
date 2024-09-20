'use client';
import { Badge } from '~/components/ui/badge';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import CopyButton from './copy-button';
import ImagePreview from './image-preview';
import UpdateTemplate from './update';

export default function ItemEntry({
  item,
  tags,
}: {
  item: {
    id: string;
    description: string | null;
    imageUrls: string[];
    tags: string[];
  };
  tags: { all: string[]; selected: string[] };
}) {
  return (
    <div className="group rounded-lg border bg-primary-foreground/50 p-3">
      <div className="">
        <div className="relative mb-2 line-clamp-1 h-8 cursor-pointer text-xl font-semibold">
          Template {item.id}
          <UpdateTemplate
            template={item}
            tags={tags}
          />
        </div>
        <div className="mb-2 grid h-44 grid-cols-2 grid-rows-2 gap-1">
          {item.imageUrls.slice(0, 4).map((url, index) => (
            <ImagePreview
              key={url + index}
              className={cn(
                'h-full cursor-default rounded-md border bg-card object-cover',
                item.imageUrls.length + index === 1 && 'col-span-2 row-span-2',
                item.imageUrls.length === 2 && 'row-span-2',
                item.imageUrls.length === 3 && index === 2 && 'col-span-2',
              )}
              width={300}
              height={300}
              src={url}
              alt={item.description || ''}
            />
          ))}
          {item.imageUrls.length === 0 && (
            <div className="col-span-2 row-span-2 flex items-center justify-center text-muted-foreground">
              No Previews
            </div>
          )}
        </div>
        <ScrollArea className="pb-2">
          <div className="flex flex-row gap-2">
            {item.tags.map((tag) => (
              <Badge
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <ScrollBar
            orientation="horizontal"
            className="h-1.5"
          />
        </ScrollArea>
        <p className="line-clamp-2 h-8 text-xs text-muted-foreground">
          {item.description || 'No Description Provided'}
        </p>
      </div>
    </div>
  );
}
