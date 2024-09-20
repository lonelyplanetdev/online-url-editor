import { DALibraryItem } from '@prisma/client';
import { ScrollArea } from '~/components/ui/scroll-area';
import CreateTemplate from './entry/create';
import ItemEntry from './entry';
import PageNumberSelector from './pagenumber';
import PageSizeSelector from './pagesize';
import RowSizeSelector from './rowsize';
import Tags from './tags';

function DALibraryTool({
  tags,
  items,
}: {
  tags: { all: string[]; selected: string[] };
  items: {
    filtered: (DALibraryItem & { tags: string[] })[];
    page: number;
    pageSize: number;
    totalPages: number;
  };
}) {
  const usingGroupedEntries = tags.selected.length > 1;

  const groupedEntries = tags.selected.reduce(
    (acc, tag) => {
      acc[tag] = items.filtered.filter((item) => item.tags.includes(tag)).sort((a, b) => Number(a.id) - Number(b.id));
      return acc;
    },
    {} as Record<string, (DALibraryItem & { tags: string[] })[]>,
  );

  return (
    <div className="grid h-[calc(100vh-15rem)] grid-rows-[5.5rem_auto_3rem] gap-8">
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <span className="font-semibold">Tag Manager</span>
          <div className="flex flex-row-reverse items-center gap-2">
            <CreateTemplate tags={tags} />
          </div>
        </div>
        <Tags tags={tags} />
      </div>
      <ScrollArea>
        {!usingGroupedEntries && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {items.filtered.map((item) => (
              <ItemEntry
                key={item.id}
                item={item}
                tags={tags}
              />
            ))}
          </div>
        )}
        {usingGroupedEntries &&
          Object.entries(groupedEntries).map(([tag, entries]) => (
            <div key={tag}>
              <h2>{tag}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {entries.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-center"
                  >
                    <ItemEntry
                      item={item}
                      tags={tags}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </ScrollArea>
      <div className="flex flex-row-reverse gap-3">
        {usingGroupedEntries ? (
          <RowSizeSelector />
        ) : (
          <>
            <PageNumberSelector totalPages={items.totalPages} />
            <PageSizeSelector />
          </>
        )}
      </div>
    </div>
  );
}

export { DALibraryTool };
