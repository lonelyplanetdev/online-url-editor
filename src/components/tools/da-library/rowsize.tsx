'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'; // Adjust the import path as needed
import { Label } from '~/components/ui/label'; // Adjust the import path as needed
import { persist } from 'zustand/middleware';
import { DEFAULT_ROW_SIZE, ROW_SIZE_OPTIONS } from './constants';

export default function RowSizeSelector() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the current page size from the URL parameters or default to 10
  const currentPageSize = ROW_SIZE_OPTIONS.includes(Number(searchParams.get('rowSize')))
    ? Number(searchParams.get('rowSize'))
    : DEFAULT_ROW_SIZE;

  const handlePageSizeChange = (size: number) => {
    // Create a new URLSearchParams object to update the URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('rowSize', size.toString());

    // Update the URL with the new page size
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="page-size-selector flex w-48 flex-row items-center gap-1.5">
      <Select
        value={currentPageSize.toString()}
        onValueChange={(value: string) => handlePageSizeChange(Number(value))}
      >
        <SelectTrigger className="grow">
          <SelectValue placeholder="Select row size" />
        </SelectTrigger>
        <SelectContent>
          {ROW_SIZE_OPTIONS.map((size) => (
            <SelectItem
              key={size}
              value={size.toString()}
            >
              {size} entries per tag
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
