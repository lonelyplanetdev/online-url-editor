'use client';

import { useCallback, useState, useTransition, useId } from 'react';
import { DateRange } from '~/components/tools/dots-analysis';
import { DateRangePicker } from '~/components/tools/dots-analysis/filtering/date-range';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import type { AdClickReportItem } from '~/lib/ads.com';

interface AdsComReportClientProps {
  action: (utcDatetimeRange: [string, string]) => Promise<AdClickReportItem[]>;
}

const jsonToCsv = (json: any) => {
  const headers = Object.keys(json[0]);
  const csv = [headers, ...json.map((row: any) => Object.values(row))].join('\n');
  return csv;
};

const downloadCsv = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};
const extractDateRange = (dateRange: DateRange): [string, string] => {
  const pad = (num: number) => num.toString().padStart(2, '0');

  const startBase = new Date(
    `${dateRange.from.getFullYear()}-${pad(dateRange.from.getMonth() + 1)}-${pad(dateRange.from.getDate())} 00:00:00`,
  );
  const endBase = new Date(
    `${dateRange.to.getFullYear()}-${pad(dateRange.to.getMonth() + 1)}-${pad(dateRange.to.getDate())} 23:59:59`,
  );

  const startString = `${startBase.getFullYear()}-${pad(startBase.getMonth() + 1)}-${pad(startBase.getDate())} ${pad(startBase.getHours())}:${pad(startBase.getMinutes())}:${pad(startBase.getSeconds())}`;
  const endString = `${endBase.getFullYear()}-${pad(endBase.getMonth() + 1)}-${pad(endBase.getDate())} ${pad(endBase.getHours())}:${pad(endBase.getMinutes())}:${pad(endBase.getSeconds())}`;
  return [startString, endString];
};

export default function AdsComReportClient({ action }: AdsComReportClientProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isDisabled = !dateRange || isPending;
  const fetchReport = useCallback(() => {
    if (!dateRange) return;
    startTransition(() => {
      setError(null);
      action(extractDateRange(dateRange))
        .then((report) => {
          setReport(report);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    });
  }, [dateRange, action]);

  const [report, setReport] = useState<AdClickReportItem[]>([]);

  const summedReport = report.reduce(
    (acc, curr) => {
      acc.totals.visits += curr.visits;
      acc.totals.clicks += curr.clicks;
      acc.totals.estimated_revenue += curr.estimated_revenue;
      return acc;
    },
    { totals: { visits: 0, clicks: 0, estimated_revenue: 0 } },
  );

  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <DateRangePicker
          className="flex-1"
          onRangeSelect={useCallback((range: any) => {
            setDateRange(range);
          }, [])}
          disabled={isDisabled}
        />
        <Button
          disabled={isDisabled}
          onClick={fetchReport}
        >
          Fetch Report
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {report.length > 0 && (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Totals</div>
            <div className="text-sm font-medium">
              {summedReport.totals.visits} visits, {summedReport.totals.clicks} clicks,{' '}
              {summedReport.totals.estimated_revenue.toFixed(2)} estimated revenue
            </div>
          </div>
        </div>
      )}

      <Button onClick={() => downloadCsv(jsonToCsv(report), 'report.csv')}>Download CSV</Button>
    </div>
  );
}
