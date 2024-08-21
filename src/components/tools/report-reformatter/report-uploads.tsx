'use client';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import type { ReportDataRow } from '.';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

import Papa from 'papaparse';

interface ReportUploadsProps {
  onFacebookData: (data: ReportDataRow[] | null) => void;
  onNewsbreakData: (data: ReportDataRow[] | null) => void;
}
function ReportUploads({ onFacebookData, onNewsbreakData }: ReportUploadsProps) {
  const [facebookReport, setFacebookReport] = useState<ReportDataRow[] | null>(null);
  const [facebookError, setFacebookError] = useState<string | null>(null);

  const [newsbreakReport, setNewsbreakReport] = useState<ReportDataRow[] | null>(null);
  const [newsbreakError, setNewsbreakError] = useState<string | null>(null);

  const requiredFacebookHeaders = ['day', 'campaign_name', 'amount_spent', 'cost_per_lead', 'cpc', 'link_clicks'];
  const requiredNewsbreakHeaders = ['date', 'campaign', 'cost', 'click', 'cpc', 'cpa'];

  return (
    <div className="flex w-full flex-col justify-start gap-8 lg:flex-row lg:gap-2">
      <div className="grid w-full grow gap-1 lg:basis-1/2">
        <Label className={facebookError ? 'text-destructive' : ''}>Facebook Report</Label>
        <p className={cn('text-xs text-muted-foreground', facebookError && 'text-destructive')}>
          {facebookError
            ? facebookError
            : 'Required headers: ' +
              requiredFacebookHeaders
                .join(', ')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase())}
        </p>
        <div className="flex flex-row gap-2">
          <Input
            type="file"
            accept=".csv,text/csv"
            id="facebookFileInput"
            className={cn('w-full', facebookError && 'border-destructive')}
            onChange={(btne) => {
              const file = btne.target.files?.[0];

              if (!file) {
                setFacebookError(null);
                setFacebookReport(null);
                return;
              }

              const filename = file.name;
              const reader = new FileReader();

              reader.onload = (e) => {
                if (e.target === null || e.target?.result === null) {
                  setFacebookError('Failed to read file ' + filename);
                  btne.target.value = '';
                  return;
                }

                try {
                  const csvString = e.target.result as string;
                  const { data } = Papa.parse(csvString, {
                    header: true,
                    transformHeader: (header) =>
                      header
                        .trim()
                        .toLowerCase()
                        .replace(/\(.*?\)/g, '')
                        .replace(/\s/g, '_')
                        .replace(/(^_|_$)/g, ''),
                  }) as { data: any };

                  if (!data) {
                    setFacebookError('Failed to parse file ' + filename);
                    btne.target.value = '';
                    return;
                  }

                  const missingHeaders = requiredFacebookHeaders.filter((header) => !data[0].hasOwnProperty(header));
                  if (missingHeaders.length > 0) {
                    setFacebookError(`Report ${filename} missing ${missingHeaders.join(', ')}`);
                    btne.target.value = '';
                    return;
                  }

                  let parsedData = data.map((row: any) => ({
                    date: row.day,
                    campaign_name: row.campaign_name,
                    spend: row.amount_spent
                      ? (parseFloat(row.amount_spent.replace(/[^0-9.]/g, '')) || 0).toFixed(2)
                      : '0.00',
                    uniques: row.link_clicks ? parseInt(row.link_clicks.replace(/[^0-9.]/g, '')) || 0 : '0.00',
                    cpc: row.cpc ? (parseFloat(row.cpc.replace(/[^0-9.]/g, '')) || 0).toFixed(2) : '0.00',
                    cpr: row.cost_per_lead
                      ? (parseFloat(row.cost_per_lead.replace(/[^0-9.]/g, '')) || 0).toFixed(2)
                      : '0.00',
                    traffic_source: 'Facebook',
                  })) as ReportDataRow[];

                  // name isnt total or undefined
                  parsedData = parsedData.filter(
                    (row) => row.campaign_name !== 'Total' && row.campaign_name !== undefined,
                  );

                  setFacebookReport(parsedData);
                  onFacebookData(parsedData);
                } catch (error) {
                  setFacebookError('Failed to parse file ' + filename);
                  btne.target.value = '';
                }
                setFacebookError(null);
              };
              reader.readAsText(file);
            }}
          />
          <Button
            variant="destructive"
            disabled={facebookReport === null}
            onClick={() => {
              setFacebookReport(null);
              onFacebookData(null);
              const fileInput = document.getElementById('facebookFileInput') as HTMLInputElement;
              if (fileInput) {
                fileInput.value = '';
              }
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="grid w-full grow basis-1/2 gap-1">
        <Label className={newsbreakError ? 'text-destructive' : ''}>Newsbreak Report</Label>
        <p className={cn('text-xs text-muted-foreground', newsbreakError && 'text-destructive')}>
          {newsbreakError
            ? newsbreakError
            : 'Required headers: ' +
              requiredNewsbreakHeaders
                .join(', ')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase())}
        </p>
        <div className="flex flex-row gap-2">
          <Input
            type="file"
            accept=".csv,text/csv"
            id="newsbreakFileInput"
            className={cn('w-full', newsbreakError && 'border-destructive')}
            onChange={(btne) => {
              const file = btne.target.files?.[0];

              if (!file) {
                setNewsbreakError(null);
                setNewsbreakReport(null);
                return;
              }

              const filename = file.name;
              const reader = new FileReader();

              reader.onload = (e) => {
                if (e.target === null || e.target?.result === null) {
                  setNewsbreakError('Failed to read file ' + filename);
                  btne.target.value = '';
                  return;
                }

                try {
                  const csvString = e.target.result as string;
                  const { data } = Papa.parse(csvString, {
                    header: true,
                    transformHeader: (header) =>
                      header
                        .trim()
                        .toLowerCase()
                        .replace(/\(.*?\)/g, '')
                        .replace(/\s/g, '_')
                        .replace(/(^_|_$)/g, ''),
                  }) as { data: any };

                  if (!data) {
                    setNewsbreakError('Failed to parse file ' + filename);
                    btne.target.value = '';
                    return;
                  }

                  const missingHeaders = requiredNewsbreakHeaders.filter((header) => !data[0].hasOwnProperty(header));
                  if (missingHeaders.length > 0) {
                    setNewsbreakError(`Report ${filename} missing ${missingHeaders.join(', ')}`);
                    btne.target.value = '';
                    return;
                  }

                  let parsedData = data.map((row: any) => ({
                    date: row.date,
                    campaign_name: row.campaign,
                    spend: row.cost ? (parseFloat(row.cost.replace(/[^0-9.]/g, '')) || 0).toFixed(2) : '0.00',
                    uniques: row.click ? parseInt(row.click.replace(/[^0-9.]/g, '')) || 0 : '0.00',
                    cpc: row.cpc ? (parseFloat(row.cpc.replace(/[^0-9.]/g, '')) || 0).toFixed(2) : '0.00',
                    cpr: row.cpa ? (parseFloat(row.cpa.replace(/[^0-9.]/g, '')) || 0).toFixed(2) : '0.00',
                    traffic_source: 'News Break',
                  })) as ReportDataRow[];

                  parsedData = parsedData.filter(
                    (row) => row.campaign_name !== 'Total' && row.campaign_name !== undefined,
                  );

                  setNewsbreakReport(parsedData);
                  onNewsbreakData(parsedData);
                } catch (error) {
                  setNewsbreakError('Failed to parse file ' + filename);
                  btne.target.value = '';
                }
                setNewsbreakError(null);
              };
              reader.readAsText(file);
            }}
          />
          <Button
            variant="destructive"
            disabled={newsbreakReport === null}
            onClick={() => {
              setNewsbreakReport(null);
              onNewsbreakData(null);
              const fileInput = document.getElementById('newsbreakFileInput') as HTMLInputElement;
              if (fileInput) {
                fileInput.value = '';
              }
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ReportUploads };
