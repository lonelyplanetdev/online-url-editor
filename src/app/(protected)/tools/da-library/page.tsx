import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';
import { db } from '~/lib/db';
import { DALibraryItem, DALibraryTag } from '@prisma/client';
import { validateRequest } from '~/lib/auth';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { DEFAULT_PAGE_SIZE, DEFAULT_ROW_SIZE } from '~/components/tools/da-library/constants';
import { DALibraryTool } from '~/components/tools/da-library';

export default async function DALibraryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  const dbLibraryTags = await cache(
    async () =>
      (
        await db.dALibraryTag
          .findMany({
            orderBy: [{ name: 'asc' }],
            select: { name: true },
          })
          .catch(() => [])
      ).map((tag) => tag.name) as string[],
  )();

  const urlTags = (
    searchParams.tags
      ? Array.isArray(searchParams.tags)
        ? searchParams.tags
        : searchParams.tags.split(',')
      : ([] as string[])
  ).map((tag) => tag.trim().toLowerCase());
  const validTags = dbLibraryTags.filter((tagName) => urlTags.includes(tagName));

  const urlPage = Number(
    searchParams.page ? (Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page) : 1,
  );
  const urlPageSize =
    Number(
      searchParams.pageSize
        ? Array.isArray(searchParams.pageSize)
          ? searchParams.pageSize[0]
          : searchParams.pageSize
        : DEFAULT_PAGE_SIZE,
    ) || DEFAULT_PAGE_SIZE;
  const urlRowSize =
    Number(
      searchParams.rowSize
        ? Array.isArray(searchParams.rowSize)
          ? searchParams.rowSize[0]
          : searchParams.rowSize
        : DEFAULT_ROW_SIZE,
    ) || DEFAULT_ROW_SIZE;

  var filteredItems: (DALibraryItem & { tags: string[] })[] = [];
  var maxPage = 0;
  const multipleTags = validTags.length > 1;
  const singleTag = validTags.length === 1;
  const lookupType = multipleTags ? 'multiple' : singleTag ? 'single' : 'none';
  switch (lookupType) {
    case 'multiple':
      await Promise.all([
        db.dALibraryItem
          .findMany({
            where: { tags: { some: { name: { in: validTags } } } },
            orderBy: [{ id: 'asc' }],
            skip: (urlPage - 1) * urlPageSize,
            take: urlPageSize,
            select: {
              id: true,
              description: true,
              imageUrls: true,
              tags: {
                select: { name: true },
              },
            },
          })
          .then((items) => {
            filteredItems = items.map((item) => ({ ...item, tags: item.tags.map((tag) => tag.name) }));
          }),
      ]);
      break;
    case 'single':
      await Promise.all([
        db.dALibraryItem
          .findMany({
            where: { tags: { some: { name: validTags[0] } } },
            orderBy: [{ id: 'asc' }],
            skip: (urlPage - 1) * urlPageSize,
            take: urlPageSize,
            select: {
              id: true,
              description: true,
              imageUrls: true,
              tags: {
                select: { name: true },
              },
            },
          })
          .then((items) => {
            filteredItems = items.map((item) => ({ ...item, tags: item.tags.map((tag) => tag.name) }));
          }),
        db.dALibraryItem
          .count({
            where: { tags: { some: { name: validTags[0] } } },
          })
          .then((count) => {
            maxPage = Math.ceil(count / urlPageSize);
          }),
      ]);
      break;
    case 'none':
      await Promise.all([
        db.dALibraryItem
          .findMany({
            orderBy: [{ id: 'asc' }],
            skip: (urlPage - 1) * urlPageSize,
            take: urlPageSize,
            select: {
              id: true,
              description: true,
              imageUrls: true,
              tags: {
                select: { name: true },
              },
            },
          })
          .then((items) => {
            filteredItems = items.map((item) => ({ ...item, tags: item.tags.map((tag) => tag.name) }));
          }),
        db.dALibraryItem.count().then((count) => {
          maxPage = Math.ceil(count / urlPageSize);
        }),
      ]);
      break;
  }

  return (
    <>
      <PageHeader>
        <PageTitle>DomainActive Lander Template Library</PageTitle>
        <PageDescription>Upload your meta and newsbreak reports to reformat them for upload to DOTS.</PageDescription>
      </PageHeader>
      <PageContent container>
        <DALibraryTool
          tags={{ all: dbLibraryTags, selected: validTags }}
          items={{
            filtered: filteredItems.sort((a, b) => Number(a.id) - Number(b.id)),
            page: urlPage,
            pageSize: urlPageSize,
            totalPages: maxPage,
          }}
        />
      </PageContent>
    </>
  );
}
