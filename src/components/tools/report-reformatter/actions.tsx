'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import type { ReportDataRow } from '.';

interface ActionsProps {
  output: ReportDataRow[] | null;
}
export function Actions({ output }: ActionsProps) {
  const outputTSVString = output ? [...output.map((row) => Object.values(row).join('\t'))].join('\n') : '';
  const outputCSVSring = output ? [...output.map((row) => Object.values(row).join(','))].join('\n') : '';

  const [copyFullButtonLabel, setCopyFullButtonLabel] = useState('Copy Data');

  return (
    <div>
      <div className="grid gap-1.5">
        <Label htmlFor="url_builder_output">Actions</Label>
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            className="w-32"
            disabled={!output}
            onClick={() => {
              // copy full url
              navigator.clipboard.writeText(outputTSVString);
              setCopyFullButtonLabel('Copied!');
              setTimeout(() => {
                setCopyFullButtonLabel('Copy Data');
              }, 1000);
            }}
          >
            {copyFullButtonLabel}
          </Button>
          <Button
            variant="outline"
            className="w-48"
            disabled={!output}
            asChild={!!output}
          >
            <Link
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(outputCSVSring)}`}
              download="output.csv"
            >
              Download as CSV
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
