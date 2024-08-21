'use client';

import * as React from 'react';

import type { ReportDataRow } from '.';

import { Label } from '~/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';

interface OutputDataProps {
  output: ReportDataRow[] | null;
}
function OutputData({ output }: OutputDataProps) {
  const outputString = output ? [...output.map((row) => Object.values(row).join('\t'))].join('\n') : '';

  const [outputView, setOutputView] = React.useState<'table' | 'string'>('table');

  return (
    <div className="-mt-2 grid gap-1.5">
      <div className="flex flex-row items-end justify-between">
        <Label>Output Results</Label>
        <Button
          variant="secondary"
          disabled={!(output && output.length > 0)}
          className="w-36"
          onClick={() => setOutputView(outputView === 'table' ? 'string' : 'table')}
        >
          {outputView === 'table' ? 'View as Text' : 'View as Table'}
        </Button>
      </div>
      {output && output.length > 0 ? (
        outputView === 'string' ? (
          <Textarea
            readOnly
            className="h-96 resize-none"
            defaultValue={outputString}
          />
        ) : (
          <ScrollArea className="h-96 overflow-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-primary-foreground">
                <TableRow>
                  {Object.keys(output?.[0] ?? {}).map((header) => (
                    <TableHead key={header}>
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
                      <TableCell key={index}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )
      ) : (
        <div className="flex h-96 items-center justify-center rounded-md border">
          <p className="text-sm text-muted-foreground">No Data to Display</p>
        </div>
      )}
    </div>
  );
}

export { OutputData };
