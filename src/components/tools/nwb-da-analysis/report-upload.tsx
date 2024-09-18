'use client';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import type { ReportDataRow } from '.';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

import { read, utils } from 'xlsx';

interface ReportUploadsProps {
  onDOTSData: (data: ReportDataRow[] | null) => void;
}
function ReportUpload({ onDOTSData }: ReportUploadsProps) {
  const [DOTSReport, setDOTSReport] = useState<ReportDataRow[] | null>(null);
  const [DOTSError, setDOTSError] = useState<string | null>(null);

  const requiredDOTSHeaders = [
    'campaign',
    'date',
    'traffic_source',
    'provider',
    'campagin_manager',
    'domain',
    'spend',
    'revenue',
    'uniques',
    'uniques',
    'uniques_1',
    'clicks',
  ];

  return (
    <div className="grid gap-1.5">
      <Label className={DOTSError ? 'text-destructive' : ''}>DOTS Report</Label>
      <p className={cn('text-xs text-muted-foreground', DOTSError && 'text-destructive')}>
        {DOTSError
          ? DOTSError
          : 'Required headers: ' +
            requiredDOTSHeaders
              .join(', ')
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())}
      </p>
      <div className="flex flex-row gap-2">
        <Input
          type="file"
          accept=".xlsx"
          id="DOTSFileInput"
          className={cn('w-full', DOTSError && 'border-destructive')}
          onChange={async (btne) => {
            const file = btne.target.files?.[0];
            const filename = file?.name;

            if (!file || !filename) {
              setDOTSError(null);
              setDOTSReport(null);
              return;
            }

            const data = await file.arrayBuffer();
            const workbook = read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = utils.sheet_to_json(sheet).map((row: any) => {
              const transformedRow: any = {};
              for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                  const transformedKey = key
                    .toLowerCase()
                    .replace(/ /g, '_')
                    .replace(/[^a-z0-9_]/g, '')
                    .replace(/^_|_$/g, '')
                    .replace(/_{2,}/g, '_');

                  transformedRow[transformedKey] = row[key];
                }
              }
              return transformedRow;
            });

            const allValidHeaders = Array.from(new Set(rows.map((row: any) => Object.keys(row)).flat()));

            const missingHeaders = requiredDOTSHeaders.filter((header) => !allValidHeaders.includes(header));
            if (missingHeaders.length > 0) {
              setDOTSError(`${filename} missing ${missingHeaders.join(', ')}`);
              return;
            }

            const parsedData = rows.map((row: any) => {
              const needed = [
                {
                  header: 'campaign',
                  type: 'string',
                },
                {
                  header: 'date',
                  type: 'string',
                },
                {
                  header: 'traffic_source',
                  type: 'string',
                },
                {
                  header: 'provider',
                  type: 'string',
                },
                {
                  header: 'campagin_manager',
                  type: 'string',
                },
                {
                  header: 'domain',
                  type: 'string',
                },
                {
                  header: 'spend',
                  type: 'float',
                },
                {
                  header: 'revenue',
                  type: 'float',
                },
                {
                  header: 'uniques',
                  type: 'number',
                },
                {
                  header: 'uniques_1',
                  type: 'number',
                },
                {
                  header: 'clicks',
                  type: 'number',
                },
              ];

              const parsedRow: any = {};

              for (const { header, type } of needed) {
                const value = row[header];

                if (typeof value === 'string' && type === 'string') parsedRow[header] = value.trim() || 'unknown';
                else if (typeof value === 'number' && type === 'float' && !isNaN(value))
                  parsedRow[header] = (value || 0).toFixed(2);
                else if (typeof value === 'number' && type === 'number' && !isNaN(value))
                  parsedRow[header] = (value || 0).toFixed(0);
                else parsedRow[header] = type === 'number' || type === 'float' ? 0 : 'unknown';
              }

              return {
                date: parsedRow.date,
                campaign: parsedRow.campaign,
                source: parsedRow.traffic_source,
                provider: parsedRow.provider,
                manager: parsedRow.campagin_manager,
                domain: parsedRow.domain,
                spend: parseFloat(parsedRow.spend),
                revenue: parseFloat(parsedRow.revenue),
                uniques: parseInt(parsedRow.uniques_1),
                link_click: parseInt(parsedRow.uniques),
                ad_click: parseInt(parsedRow.clicks),
              };
            });

            setDOTSReport(parsedData);
            setDOTSError(null);
            onDOTSData(parsedData);
          }}
        />
        <Button
          variant="destructive"
          disabled={DOTSReport === null}
          onClick={() => {
            setDOTSReport(null);
            onDOTSData(null);
            const fileInput = document.getElementById('DOTSFileInput') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export { ReportUpload };
