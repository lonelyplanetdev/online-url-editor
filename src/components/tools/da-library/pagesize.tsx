'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'; // Adjust the import path as needed
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from './constants';

export default function PageSizeSelector() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the current page size from the URL parameters or default to 10
  const currentPageSize = PAGE_SIZE_OPTIONS.includes(Number(searchParams.get('pageSize')))
    ? Number(searchParams.get('pageSize'))
    : DEFAULT_PAGE_SIZE;

  const handlePageSizeChange = (size: number) => {
    // Create a new URLSearchParams object to update the URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', size.toString());

    // Update the URL with the new page size
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="page-size-selector flex-page flex w-48 items-center gap-1.5">
      <Select
        value={currentPageSize.toString()}
        onValueChange={(value: string) => handlePageSizeChange(Number(value))}
      >
        <SelectTrigger className="gpage">
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem
              key={size}
              value={size.toString()}
            >
              {size} entries per page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
