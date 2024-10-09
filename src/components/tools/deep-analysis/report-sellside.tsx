'use client';

import * as React from 'react';

import { SellsideSource, SellsideDataRow } from '.';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

import Papa from 'papaparse';

interface DomainActiveReportProps {
  onData?: (filename: string, data: SellsideDataRow[]) => void;
  onError?: (error: string) => void;
}

export function DomainActiveReport({ onData, onError }: DomainActiveReportProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const clearInput = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  const triggerData = React.useCallback(
    (filename: string, data: SellsideDataRow[]) => {
      onData?.(filename, data);
      clearInput();
    },
    [clearInput, onData],
  );
  const triggerError = React.useCallback(
    (error: string) => {
      onError?.(error);
      clearInput();
    },
    [clearInput, onError],
  );

  const requiredColumns = React.useMemo(
    () => ['day', 'ad_id', 'revenue_clicks', 'publisher_revenue_amount', 'lander_visitors'],
    [],
  );

  return (
    <div className="grid gap-1.5">
      <Label>DomainActive Report</Label>
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

              let isBadData = false;

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

              const parsedData: SellsideDataRow[] = data
                .map((d) => {
                  return {
                    source: SellsideSource.DOMAINACTIVE,
                    date: d['day'] || '',
                    ad_id: d['ad_id'],
                    ad_clicks: parseInt(d['revenue_clicks'], 10) || 0,
                    revenue: parseFloat(d['publisher_revenue_amount']) || 0,
                    views: parseInt(d['lander_visitors'], 10) || 0,
                  };
                })
                .filter((d) => d.date && d.ad_id)
                .reduce((acc, curr) => {
                  const existingRow = acc.find((row) => row.date === curr.date && row.ad_id === curr.ad_id);
                  if (existingRow) {
                    existingRow.ad_clicks += curr.ad_clicks;
                    existingRow.revenue += curr.revenue;
                    existingRow.views += curr.views;
                    return acc;
                  }
                  return [...acc, curr];
                }, [] as SellsideDataRow[]);

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

interface AdsComReportProps {
  onData?: (filename: string, data: SellsideDataRow[]) => void;
  onError?: (error: string) => void;
}

export function AdsComReport({ onData, onError }: AdsComReportProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const clearInput = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  const triggerData = React.useCallback(
    (filename: string, data: SellsideDataRow[]) => {
      onData?.(filename, data);
      clearInput();
    },
    [clearInput, onData],
  );
  const triggerError = React.useCallback(
    (error: string) => {
      onError?.(error);
      clearInput();
    },
    [clearInput, onError],
  );

  const requiredColumns = React.useMemo(
    () => ['server_datetime', 'subid_1', 'visits', 'clicks', 'estimated_revenue'],
    [],
  );

  return (
    <div className="grid gap-1.5">
      <Label>Ads.com Report</Label>
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

              let isBadData = false;

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

              const parsedData: SellsideDataRow[] = data
                .map((d) => {
                  const adIdRaw = d['subid_1'] || '';
                  const adId = adIdRaw.replace(/^ad_id-/, ''); // Remove "ad_id-" from the start

                  return {
                    source: SellsideSource.ADSCOM, // Update source
                    date: d['server_datetime'] || '',
                    ad_id: adId,
                    ad_clicks: parseInt(d['clicks'], 10) || 0,
                    revenue: parseFloat(d['estimated_revenue']) || 0,
                    views: parseInt(d['visits'], 10) || 0,
                  };
                })
                .filter((d) => d.date && d.ad_id)
                .reduce((acc, curr) => {
                  const existingRow = acc.find((row) => row.date === curr.date && row.ad_id === curr.ad_id);
                  if (existingRow) {
                    existingRow.ad_clicks += curr.ad_clicks;
                    existingRow.revenue += curr.revenue;
                    existingRow.views += curr.views;
                    return acc;
                  }
                  return [...acc, curr];
                }, [] as SellsideDataRow[]);

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
