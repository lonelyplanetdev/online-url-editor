'use client';

import * as React from 'react';

import { BuysideSource, BuysideDataRow } from '.';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

import Papa from 'papaparse';

interface NewsbreakReportProps {
  onData?: (filename: string, data: BuysideDataRow[]) => void;
  onError?: (error: string) => void;
}
export function NewsbreakReport({ onData, onError }: NewsbreakReportProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const triggerData = React.useCallback(
    (filename: string, data: BuysideDataRow[]) => onData?.(filename, data),
    [onData],
  );
  const triggerError = React.useCallback((error: string) => onError?.(error), [onError]);
  const clearInput = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  // for domainaactive wrong columns
  // const requiredColumns = React.useMemo(
  //   () => ['campaign__name', 'ad_id', 'revenue_clicks', 'publisher_revenue_amount', 'lander_visitors'],
  //   [],
  // );

  const requiredColumns = React.useMemo(
    () => ['Date', 'Ad', 'Ad id', 'Ad set', 'Ad set id', 'Campaign', 'Campaign id', 'Click', 'Cost', 'Impression'],
    [],
  );

  return (
    <div className="grid gap-1.5">
      <Label>Newsbreak Report</Label>
      <Input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="w-full"
        onChange={(e) => {
          if (!e.target.files) return;
          const file = e.target.files[0];

          const reader = new FileReader();
          reader.onload = async (e) => {
            if (!e.target?.result) return;
            const result = e.target.result as string;

            try {
              const { data } = Papa.parse<Record<string, string>>(result, {
                header: true,
              });

              var isBadData: boolean = false;

              const allKeys = new Set<string>(data.map((d) => Object.keys(d)).flat());
              for (const key of requiredColumns) {
                if (!allKeys.has(key)) {
                  isBadData = true;
                  break;
                }
              }

              if (isBadData) {
                triggerError('Invalid CSV file');
                return;
              }

              const parsedData: BuysideDataRow[] = data
                .map((d) => {
                  return {
                    source: BuysideSource.NEWSBREAK,
                    date: d['Date'],
                    ad_id: d['Ad id'],
                    ad_name: d['Ad'],
                    adset_id: d['Ad set id'],
                    adset_name: d['Ad set'],
                    campaign_id: d['Campaign id'],
                    campaign_name: d['Campaign'],
                    spend: parseFloat(`${d['Cost']}`.replace(/[^0-9.-]+/g, '')) || 0,
                    clicks: parseInt(d['Click']) || 0,
                    impressions: parseInt(d['Impression']) || 0,
                  };
                })
                .filter((d) => d.date && d.spend !== null && d.clicks !== null && d.impressions !== null)
                .reduce((acc, curr) => {
                  const existingRow = acc.find(
                    (row) =>
                      row.date === curr.date &&
                      row.ad_id === curr.ad_id &&
                      row.adset_id === curr.adset_id &&
                      row.campaign_id === curr.campaign_id,
                  );
                  if (existingRow) {
                    existingRow.spend += curr.spend;
                    existingRow.clicks += curr.clicks;
                    existingRow.impressions += curr.impressions;
                    return acc;
                  }
                  return [...acc, curr];
                }, [] as BuysideDataRow[]);

              const filename = file.name;

              triggerData(filename, parsedData);
              clearInput();
            } catch (e) {
              console.error(e);
              triggerError('Invalid CSV file');
            }
          };
          reader.readAsText(file);
        }}
      />
    </div>
  );
}
