'use client';

import * as React from 'react';
import { addDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Settings, Upload, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import { NewsbreakReport, MetaReport } from './report-buyside';
import { AdsComReport, DomainActiveReport } from './report-sellside';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import Viewer from './viewer';
import Filtering, { StringFilter, NumberFilter } from './filtering';
import { DatePickerWithRange } from './date-range';
import type { DateRange as RDPDateRange } from 'react-day-picker';

export enum BuysideSource {
  NEWSBREAK,
  META,
}
export type BuysideDataRow = {
  source: BuysideSource;
  date: string;
  ad_id: string;
  ad_name: string;
  adset_id: string;
  adset_name: string;
  campaign_id: string;
  campaign_name: string;
  spend: number;
  clicks: number;
  impressions: number;
};

export enum SellsideSource {
  DOMAINACTIVE,
  ADSCOM,
}
export type SellsideDataRow = {
  date: string;
  ad_id: string;
  revenue: number;
  ad_clicks: number;
  views: number;
};

export type DateRange = {
  from: Date;
  to: Date;
};

export enum ReportSide {
  BUYSIDE,
  SELLSIDE,
}
export type Report =
  | {
      side: ReportSide.BUYSIDE;
      source: BuysideSource;
      filename: string;
      hash: string;
      data: BuysideDataRow[];
    }
  | {
      side: ReportSide.SELLSIDE;
      source: SellsideSource;
      filename: string;
      hash: string;
      data: SellsideDataRow[];
    };

function DeepAnalysisTool() {
  const [error, setError] = React.useState<string | null>(null);
  const [reports, setReports] = React.useState<Report[]>([]);
  const defferedReports = React.useDeferredValue(reports);
  const [uploading, setUploading] = React.useState<ReportSide>(ReportSide.BUYSIDE);
  const addReport = React.useCallback(
    (side: ReportSide, { source, filename, data }: any) =>
      sha256(JSON.stringify(data)).then((hash) => {
        setReports((reports) => [
          ...reports,
          side === ReportSide.BUYSIDE
            ? {
                side,
                source: source as BuysideSource,
                filename,
                hash,
                data: data as BuysideDataRow[],
              }
            : {
                side,
                source: source as SellsideSource,
                filename,
                hash,
                data: data as SellsideDataRow[],
              },
        ]);
      }),
    [],
  );
  const removeReport = React.useCallback((hash: string) => {
    setReports((reports) => reports.filter((report) => report.hash !== hash));
  }, []);
  const reportExists = React.useCallback(
    (data: any) => {
      return sha256(JSON.stringify(data)).then((hash) => {
        return reports.some((report) => report.hash === hash);
      });
    },
    [reports],
  );

  async function sha256(source: any) {
    const sourceBytes = new TextEncoder().encode(source);
    const digest = await crypto.subtle.digest('SHA-256', sourceBytes);
    const resultBytes = Array.from(new Uint8Array(digest));
    return resultBytes.map((x) => x.toString(16).padStart(2, '0')).join('');
  }

  const [filters, setFilters] = React.useState<(StringFilter | NumberFilter)[]>([]);

  const handleFiltersChange = React.useCallback((filters: (StringFilter | NumberFilter)[]) => {
    setFilters(filters);
  }, []);

  const defaultDateRange = React.useMemo(() => {
    // Function to get the current date in UTC-8 without the time component
    const getUTC8Date = () => {
      const now = new Date();

      // UTC-8 offset in milliseconds
      const utcOffsetMs = -8 * 60 * 60 * 1000;

      // Adjust the current time by UTC-8
      const utc8Time = new Date(now.getTime() + utcOffsetMs);

      // Extract year, month, and day in UTC
      const year = utc8Time.getUTCFullYear();
      const month = utc8Time.getUTCMonth(); // Months are 0-indexed
      const day = utc8Time.getUTCDate();

      // Create a Date object at midnight UTC of the adjusted date
      const utc8Date = new Date(Date.UTC(year, month, day));

      return utc8Date;
    };

    // Get 'to' date: current date in UTC-8 without time
    const to = getUTC8Date();

    // Calculate 'from' date: 7 days before 'to'
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const from = new Date(to.getTime() - sevenDaysInMs);

    return { from, to } as DateRange;
  }, []);

  // State to hold the selected date range
  const [dateRange, setDateRange] = React.useState<RDPDateRange | undefined>(defaultDateRange);

  const getDates = React.useCallback(
    (dateRange?: RDPDateRange) => {
      if (!dateRange) return [];
      const fullDateRange = {
        from: dateRange.from || defaultDateRange.from,
        to: dateRange.to || dateRange.from || defaultDateRange.to,
      } as DateRange;

      var dateArray = [];
      var currentDate = fullDateRange.from;
      while (currentDate <= fullDateRange.to) {
        const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        dateArray.push(formattedDate);
        currentDate = addDays(currentDate, 1);
      }
      return dateArray;
    },
    [defaultDateRange.from, defaultDateRange.to],
  );

  const handleDateRangeChange = React.useCallback((newDateRange: RDPDateRange | undefined) => {
    setDateRange(newDateRange);
  }, []);

  return (
    <div className="relative flex h-[calc(100vh-22rem)] flex-col gap-4">
      <div className="flex justify-between">
        <DatePickerWithRange
          dateRange={dateRange}
          today={defaultDateRange.to}
          onDateRange={handleDateRangeChange}
        />
        <div className="flex w-full flex-row-reverse gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="gap-1"
                size="sm"
                variant="outline"
              >
                <Settings size={16} />
                Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
              <DialogHeader>
                <DialogTitle>Upload Reports</DialogTitle>
                <DialogDescription>
                  Upload your deep reports to analyze the overlap between the all of them.
                </DialogDescription>
              </DialogHeader>
              {error && (
                <span className="rounded-md border border-destructive bg-destructive/25 p-2 text-destructive">
                  ERROR: {error}
                </span>
              )}
              <div className="flex flex-row gap-4">
                <Button
                  variant={uploading === ReportSide.BUYSIDE ? 'default' : 'secondary'}
                  className="w-full"
                  onClick={() => {
                    setUploading(ReportSide.BUYSIDE);
                  }}
                >
                  Buyside
                </Button>
                <Button
                  variant={uploading === ReportSide.SELLSIDE ? 'default' : 'secondary'}
                  className="w-full"
                  onClick={() => {
                    setUploading(ReportSide.SELLSIDE);
                  }}
                >
                  Sellside
                </Button>
              </div>
              <div className="flex flex-row gap-4">
                {uploading === ReportSide.BUYSIDE ? (
                  <>
                    <NewsbreakReport
                      onData={async (filename, data) => {
                        if (await reportExists(data)) return setError('Report already uploaded');
                        addReport(ReportSide.BUYSIDE, { source: BuysideSource.NEWSBREAK, filename, data });
                      }}
                      onError={(error) => {
                        setError(error);
                      }}
                    />
                    <MetaReport
                      onData={async (filename, data) => {
                        if (await reportExists(data)) return setError('Report already uploaded');
                        addReport(ReportSide.BUYSIDE, { source: BuysideSource.META, filename, data });
                      }}
                      onError={(error) => {
                        setError(error);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <DomainActiveReport
                      onData={async (filename, data) => {
                        if (await reportExists(data)) return setError('Report already uploaded');
                        addReport(ReportSide.SELLSIDE, { source: SellsideSource.DOMAINACTIVE, filename, data });
                      }}
                      onError={(error) => {
                        setError(error);
                      }}
                    />
                    <AdsComReport
                      onData={async (filename, data) => {
                        if (await reportExists(data)) return setError('Report already uploaded');
                        addReport(ReportSide.SELLSIDE, { source: SellsideSource.ADSCOM, filename, data });
                      }}
                      onError={(error) => {
                        setError(error);
                      }}
                    />
                  </>
                )}
              </div>
              <div className="flex w-full flex-col">
                <ScrollArea className="h-64 rounded-md border">
                  <Table>
                    <TableHeader>
                      <tr className="bg-primary-foreground">
                        <TableHead className="w-36 px-2 text-center">Source</TableHead>
                        <TableHead className="px-2">File</TableHead>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {reports
                        .filter((report) => report.side === uploading)
                        .map((report, index) => (
                          <TableRow key={index}>
                            {report.side === ReportSide.BUYSIDE ? (
                              <>
                                <TableCell className="p-2">
                                  <div className="flex w-full items-center justify-center">
                                    <Badge
                                      className={cn(
                                        report.source === BuysideSource.NEWSBREAK
                                          ? 'bg-red-500 text-white hover:bg-red-600 hover:text-white'
                                          : report.source === BuysideSource.META
                                            ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                                            : 'bg-gray-500 text-white hover:bg-gray-600 hover:text-white',
                                      )}
                                    >
                                      {report.source === BuysideSource.NEWSBREAK
                                        ? 'Newsbreak'
                                        : report.source === BuysideSource.META
                                          ? 'Meta'
                                          : 'Unknown'}
                                    </Badge>
                                  </div>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="p-2">
                                  <Badge
                                    className={cn(
                                      report.source === SellsideSource.DOMAINACTIVE
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                                        : report.source === SellsideSource.ADSCOM
                                          ? 'bg-pink-500 text-white hover:bg-pink-600 hover:text-white'
                                          : 'bg-gray-500 text-white hover:bg-gray-600 hover:text-white',
                                    )}
                                  >
                                    {report.source === SellsideSource.DOMAINACTIVE
                                      ? 'DomainActive'
                                      : report.source === SellsideSource.ADSCOM
                                        ? 'Ads.com'
                                        : 'Unknown'}
                                  </Badge>
                                </TableCell>
                              </>
                            )}
                            <TableCell className="flex items-center justify-between p-2">
                              <span>{report.filename}</span>
                              <Button
                                className="size-8 p-0 hover:bg-red-500/25 hover:text-red-500"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeReport(report.hash)}
                              >
                                <X size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      {!reports.length && (
                        <tr>
                          <TableCell
                            colSpan={3}
                            className="h-48 text-center text-sm text-muted-foreground"
                          >
                            No reports uploaded
                          </TableCell>
                        </tr>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
          <Filtering
            defaultFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>
      <Viewer
        filters={filters}
        dates={getDates(dateRange)}
        data={{
          buyside: defferedReports
            .filter((report) => report.side === ReportSide.BUYSIDE)
            .map((report) => report.data)
            .flat(),
          sellside: defferedReports
            .filter((report) => report.side === ReportSide.SELLSIDE)
            .map((report) => report.data)
            .flat(),
        }}
      />
    </div>
  );
}

export { DeepAnalysisTool };
