'use client';

import * as React from 'react';

import type { ReportDataRow } from '..';

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';

interface OutputDataProps {
  output: ReportDataRow[] | null;
}
function OutputData({ output }: OutputDataProps) {
  return output && output.length > 0 ? (
    <ScrollArea className="h-60 overflow-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-primary-foreground">
          <TableRow>
            {Object.keys(output?.[0] ?? {}).map((header) => (
              <TableHead
                key={header}
                className={cn('h-8', header === 'date' && 'w-28')}
              >
                {header
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase())
                  .replace('Cpc', 'CPC')
                  .replace('CpR', 'CPR')}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {output?.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value, index) => (
                <TableCell
                  key={index}
                  className="py-2 font-mono"
                >
                  {value === 'Facebook' ? (
                    <span className="text-indigo-500">Facebook</span>
                  ) : value === 'News Break' ? (
                    <span className="text-red-500">News Break</span>
                  ) : (
                    value
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  ) : (
    <div className="flex h-60 items-center justify-center rounded-md border">
      <p className="text-sm text-muted-foreground">No Data to Display</p>
    </div>
  );
}

export { OutputData };
