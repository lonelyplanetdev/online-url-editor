'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'; // Adjust the import path as needed
import { useMemo } from 'react';

export default function PageNumberSelector({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Create an array of page numbers
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  // Get the current page number from the URL parameters or default to 1
  const currentPage = pageNumbers.includes(Number(searchParams.get('page'))) ? Number(searchParams.get('page')) : 1;

  const handlePageChange = (page: number) => {
    // Create a new URLSearchParams object to update the URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    // Update the URL with the new page number
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="page-number-selector flex-page flex w-48 items-center gap-1.5">
      <Select
        value={currentPage.toString()}
        onValueChange={(value: string) => handlePageChange(Number(value))}
      >
        <SelectTrigger className="gpage">
          <SelectValue placeholder="Select page number" />
        </SelectTrigger>
        <SelectContent>
          {pageNumbers.map((page) => (
            <SelectItem
              key={page}
              value={page.toString()}
            >
              Page {page}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
