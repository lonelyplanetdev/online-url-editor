'use client';

import * as React from 'react';

type ReportDataRow = {
  date: string;
  campaign: string;
  source: string;
  provider: string;
  manager: string;
  domain: string;
  spend: number;
  revenue: number;
  uniques: number;
  link_click: number;
  ad_click: number;
};

import { ReportUpload } from './report-upload';
import { Filtering } from './filtering';
import { OutputTable } from './output-table';
import { addDays } from 'date-fns';

type DateRange = {
  from: Date;
  to: Date;
};

function getDates(dateRange: DateRange | undefined) {
  if (!dateRange) return [];
  var dateArray = [];
  var currentDate = dateRange.from;
  while (currentDate <= dateRange.to) {
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    dateArray.push(formattedDate);
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
}

function DOTSAnalysisTool() {
  const [report, setReport] = React.useState<ReportDataRow[] | null>();
  const [dateRange, setDateRange] = React.useState<DateRange>();
  const [searchName, setSearchName] = React.useState<string | null>();
  const [managers, setManagers] = React.useState<string[]>([]);
  const [columns, setColumns] = React.useState<string[]>([]);

  const parsedReport = React.useMemo(() => {
    if (!report) return { data: [], managers: [] };
    return {
      data: report
        .filter(
          (row) =>
            (!searchName || row.campaign.toLowerCase().includes(searchName.toLowerCase())) &&
            (!managers.length || managers.includes(row.manager)),
        )
        .filter((row) => !dateRange || getDates(dateRange).includes(row.date)),
      managers: Array.from(new Set(report.map((row) => row.manager))),
    };
  }, [report, searchName, dateRange, managers]);

  return (
    <div className="grid gap-8">
      <ReportUpload onDOTSData={(data) => setReport(data)} />
      {report ? (
        <div className="grid h-[calc(100vh-20rem)] grid-cols-1 grid-rows-[10rem_auto_auto] gap-8 lg:grid-rows-[2.5rem_auto]">
          <Filtering
            onDateRange={(range) => range && setDateRange(range)}
            onSearchName={(name) => setSearchName(name)}
            onMangersFilter={(managers) => setManagers(managers)}
            onColumnsFilter={(columns) => setColumns(columns)}
            managers={parsedReport.managers}
            columns={[
              'Source',
              'Provider',
              'Manager',
              'Domain',
              'Spend',
              'Revenue',
              'ROI',
              'Margin',
              'CTR',
              'RPM',
              'RPAC',
              'CPAC',
              'RPLC',
              'CPLC',
              'RPU',
              'CPU',
              'Link Clicks',
              'Ad Clicks',
              'Uniques',
            ]}
          />
          {/* <Visual data={parsedReport.data} /> */}
          <OutputTable
            data={parsedReport.data}
            shownColumns={columns}
          />
        </div>
      ) : (
        <div className="flex h-60 items-center justify-center rounded-md border">
          <p className="text-sm text-muted-foreground">No report uploaded</p>
        </div>
      )}
    </div>
  );
}

export { DOTSAnalysisTool };
export type { ReportDataRow, DateRange };
