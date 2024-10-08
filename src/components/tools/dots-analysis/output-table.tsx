'use client';

import * as React from 'react';
import type { ReportDataRow } from '.';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '~/components/ui/table';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';

type Column = {
  header: string;
  headerClassName?: string;

  cellClassName?: (row: ReportDataRow) => string;
  cellAccessor: (row: ReportDataRow) => React.ReactNode;

  footerClassName?: (row: ReportDataRow) => string;
  footerAccessor?: (row: ReportDataRow) => React.ReactNode;
};

const SourceBadge = ({ source }: { source: string }) => {
  if (source === 'facebook') {
    return <span className="rounded-full bg-indigo-500 px-1.5 text-white">Facebook</span>;
  } else if (source === 'news break') {
    return <span className="rounded-full bg-red-500 px-1.5 text-white">News Break</span>;
  } else {
    return <span className="rounded-full bg-gray-500 px-1.5 text-white">Unknown</span>;
  }
};

const columns: Column[] = [
  {
    header: 'Date',
    cellAccessor: (row) => row['date'],
    cellClassName: () => 'min-w-28',
    footerAccessor: (row) => 'Total Row',
    footerClassName: () => 'text-left font-bold',
  },
  {
    header: 'Campaign',
    cellAccessor: (row) => row['campaign'],
  },
  {
    header: 'Source',
    cellAccessor: (row) =>
      typeof row['source'] === 'string' ? (
        <SourceBadge source={row['source']} />
      ) : Array.isArray(row['source'] as string[]) &&
        (row['source'] as string[]).filter((source) => ['facebook', 'newsbreak'].includes(source)).length > 0 ? (
        (row['source'] as string[])
          .filter((source) => ['facebook', 'newsbreak'].includes(source))
          .map((source, index) => (
            <SourceBadge
              key={index}
              source={source}
            />
          ))
      ) : (
        <span className="rounded-full bg-gray-500 px-1.5 text-white">Unknown</span>
      ),

    cellClassName: () => 'min-w-28',
  },
  {
    header: 'Provider',
    cellAccessor: (row) => row['provider'],
    cellClassName: () => 'min-w-40',
  },
  {
    header: 'Manager',
    cellAccessor: (row) => row['manager'],
    cellClassName: () => 'min-w-24',
  },
  {
    header: 'Domain',
    cellAccessor: (row) => row['domain'],
    cellClassName: () => 'min-w-[500px]',
  },
  {
    header: 'Spend',
    cellAccessor: (row) => `$${row['spend'].toFixed(2)}`,
    footerClassName: () => 'text-right',
    footerAccessor: (row) => `$${row['spend'].toFixed(2)}`,
  },
  {
    header: 'Revenue',
    cellAccessor: (row) => `$${row['revenue'].toFixed(2)}`,
    footerClassName: () => 'text-right',
    footerAccessor: (row) => `$${row['revenue'].toFixed(2)}`,
  },
  {
    header: 'Margin',
    cellAccessor: (row) => `$${(row['revenue'] - row['spend']).toFixed(2)}`,
    cellClassName: (row) => `${row['revenue'] - row['spend'] < 0 ? 'text-red-500' : 'text-green-500'}`,
    footerClassName: () => 'text-right',
    footerAccessor: (row) => `$${(row['revenue'] - row['spend']).toFixed(2)}`,
  },
  {
    header: 'ROI',
    cellAccessor: (row) => {
      if (row['spend'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when spend is zero
      }
      return `${((row['revenue'] / row['spend'] - 1) * 100).toFixed(2)}%`;
    },
    cellClassName: (row) => {
      return row['spend'] === 0
        ? 'text-gray-500'
        : row['revenue'] / row['spend'] - 1 < 0
          ? 'text-red-500 bg-red-500/50'
          : 'text-green-500 bg-green-500/50';
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['spend'] === 0 ? 'N/A' : `${((row['revenue'] / row['spend'] - 1) * 100).toFixed(2)}%`;

      return `${((row['revenue'] / row['spend'] - 1) * 100).toFixed(2)}%`;
    },
  },
  {
    header: 'CTR',
    cellAccessor: (row) => {
      if (row['ad_click'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when ad_click is zero
      }
      return `${((row['ad_click'] / row['link_click']) * 100).toFixed(2)}%`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['ad_click'] === 0 ? 'N/A' : `${((row['ad_click'] / row['link_click']) * 100).toFixed(2)}%`;

      return `${((row['ad_click'] / row['link_click']) * 100).toFixed(2)}%`;
    },
  },
  {
    header: 'RPM',
    cellAccessor: (row) => {
      if (row['uniques'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when uniques is zero
      }
      return `$${((row['revenue'] / row['ad_click']) * 1000 * (row['ad_click'] / row['link_click'])).toFixed(2)}`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['uniques'] === 0 ? 'N/A' : `$${(row['revenue'] / row['ad_click']) * 1000}`;

      return `$${((row['revenue'] / row['ad_click']) * 1000).toFixed(2)}`;
    },
  },
  {
    header: 'RPAC',
    cellAccessor: (row) => {
      if (row['ad_click'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when ad_click is zero
      }
      return `$${(row['revenue'] / row['ad_click']).toFixed(2)}`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['ad_click'] === 0 ? 'N/A' : `$${(row['revenue'] / row['ad_click']).toFixed(2)}`;

      return `$${(row['revenue'] / row['ad_click']).toFixed(2)}`;
    },
  },
  {
    header: 'CPAC',
    cellAccessor: (row) => {
      if (row['ad_click'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when ad_click is zero
      }
      return `$${(row['spend'] / row['ad_click']).toFixed(2)}`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['ad_click'] === 0 ? 'N/A' : `$${(row['spend'] / row['ad_click']).toFixed(2)}`;

      return `$${(row['spend'] / row['ad_click']).toFixed(2)}`;
    },
  },
  {
    header: 'RPLC',
    cellAccessor: (row) => {
      if (row['link_click'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when link_click is zero
      }
      return `$${(row['revenue'] / row['link_click']).toFixed(2)}`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['link_click'] === 0 ? 'N/A' : `$${(row['revenue'] / row['link_click']).toFixed(2)}`;

      return `$${(row['revenue'] / row['link_click']).toFixed(2)}`;
    },
  },
  {
    header: 'CPLC',
    cellAccessor: (row) => {
      if (row['link_click'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when link_click is zero
      }
      return `$${(row['spend'] / row['link_click']).toFixed(2)}`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['link_click'] === 0 ? 'N/A' : `$${(row['spend'] / row['link_click']).toFixed(2)}`;

      return `$${(row['spend'] / row['link_click']).toFixed(2)}`;
    },
  },
  {
    header: 'RPU',
    cellAccessor: (row) => {
      if (row['uniques'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when uniques is zero
      }
      return `$${(row['revenue'] / row['uniques']).toFixed(2)}`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['uniques'] === 0 ? 'N/A' : `$${(row['revenue'] / row['uniques']).toFixed(2)}`;

      return `$${(row['revenue'] / row['uniques']).toFixed(2)}`;
    },
  },
  {
    header: 'CPU',
    cellAccessor: (row) => {
      if (row['uniques'] === 0) {
        return 'N/A'; // Or return an appropriate message or value when uniques is zero
      }
      return `$${(row['spend'] / row['uniques']).toFixed(2)}`;
    },
    footerClassName: () => 'text-right',
    footerAccessor: (row) => {
      row['uniques'] === 0 ? 'N/A' : `$${(row['spend'] / row['uniques']).toFixed(2)}`;

      return `$${(row['spend'] / row['uniques']).toFixed(2)}`;
    },
  },
  {
    header: 'Link Clicks',
    cellAccessor: (row) => row['link_click'],
    footerClassName: () => 'text-right',
    footerAccessor: (row) => row['link_click'],
  },
  {
    header: 'Ad Clicks',
    cellAccessor: (row) => row['ad_click'],
    footerClassName: () => 'text-right',
    footerAccessor: (row) => row['ad_click'],
  },
  {
    header: 'Uniques',
    cellAccessor: (row) => row['uniques'],
    footerClassName: () => 'text-right',
    footerAccessor: (row) => row['uniques'],
  },
];

interface OutputTableProps {
  data: ReportDataRow[];
  shownColumns: string[];
}
function OutputTable({ data, shownColumns }: OutputTableProps) {
  const groupedByCampaignRows: { [key: string]: ReportDataRow[] } = data.reduce(
    (acc: { [key: string]: ReportDataRow[] }, row) => {
      const campaign = row['campaign'];
      acc[campaign] = acc[campaign] || [];
      acc[campaign].push(row);
      return acc;
    },
    {},
  );

  return data && data.length > 0 ? (
    <ScrollArea
      type="always"
      className="rounded-md border"
    >
      <Table>
        <OutputTableFooter
          data={data}
          shownColumns={shownColumns}
        />
        <TableBody>
          {Object.keys(groupedByCampaignRows).map((campaign, index) => (
            <OutputTableBodyRow
              key={campaign + index}
              name={campaign}
              rows={groupedByCampaignRows[campaign]}
              shownColumns={shownColumns}
            />
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ) : (
    <div className="flex h-60 items-center justify-center rounded-md border">
      <p className="text-sm text-muted-foreground">No Data to Display</p>
    </div>
  );
}

function OutputTableBodyRow({
  name,
  rows,
  shownColumns,
}: {
  name: string;
  rows: ReportDataRow[];
  shownColumns: string[];
}) {
  const [isExpanded, setExpanded] = React.useState(false);

  const summedRow = rows.reduce(
    (acc: any, row) => {
      Object.keys(row).forEach((key: string) => {
        const value = row[key as keyof ReportDataRow];
        if (typeof value === 'number') acc[key as keyof ReportDataRow] = (acc[key as keyof ReportDataRow] || 0) + value;
        if (typeof value === 'string')
          acc[key as keyof ReportDataRow]
            ? acc[key as keyof ReportDataRow].includes(value) || acc[key as keyof ReportDataRow].push(value)
            : (acc[key as keyof ReportDataRow] = [value]);
        return acc;
      });
      return acc;
    },
    {} as Record<keyof ReportDataRow, number>,
  );

  return (
    <>
      <TableRow className="bg-primary-foreground/50">
        {columns
          .filter((column) => ['Date', 'Campaign', ...shownColumns].includes(column.header))
          .map((column, index) =>
            column.header === 'Date' ? (
              <TableCell
                key={index}
                className={cn('w-32 p-2 font-sans')}
              >
                <Button
                  onClick={() => setExpanded(!isExpanded)}
                  size="sm"
                  className="size-6 w-full text-left"
                  variant="ghost"
                >
                  {isExpanded ? '▼ Collapse' : '▶ Expand'}
                </Button>
              </TableCell>
            ) : column.header === 'Campaign' ? (
              <TableCell
                key={index}
                className={cn('py-2 font-sans')}
              >
                <span className="line-clamp-1">{name}</span>
              </TableCell>
            ) : (
              <TableCell
                key={index}
                className={cn('py-2 font-sans', column.cellClassName?.(summedRow))}
              >
                <span className="line-clamp-1">{column.cellAccessor(summedRow)}</span>
              </TableCell>
            ),
          )}
      </TableRow>
      {isExpanded &&
        rows.map((row, index) => (
          <TableRow key={index}>
            {columns
              .filter((column) => ['Date', 'Campaign', ...shownColumns].includes(column.header))
              .map((column, index) => (
                <TableCell
                  key={index}
                  className={cn('py-2 font-sans', column.cellClassName?.(row))}
                >
                  <span className="line-clamp-1">{column.cellAccessor(row)}</span>
                </TableCell>
              ))}
          </TableRow>
        ))}
    </>
  );
}

function OutputTableHeader({ shownColumns }: { shownColumns: string[] }) {
  return (
    <TableHeader className="sticky top-0 bg-primary-foreground">
      <TableRow>
        {columns
          .filter((column) => ['Date', 'Campaign', ...shownColumns].includes(column.header))
          .map((column, index) => (
            <TableHead
              key={index}
              className={cn(column.headerClassName)}
            >
              {column.header}
            </TableHead>
          ))}
      </TableRow>
    </TableHeader>
  );
}

function OutputTableFooter({ data, shownColumns }: { data: ReportDataRow[]; shownColumns: string[] }) {
  const row = data.reduce(
    (acc, row) => {
      Object.keys(row).forEach((key: string) => {
        const value = row[key as keyof ReportDataRow];
        if (typeof value === 'number') acc[key as keyof ReportDataRow] = (acc[key as keyof ReportDataRow] || 0) + value;
        return acc;
      });
      return acc;
    },
    {} as Record<keyof ReportDataRow, number>,
  );

  return (
    <TableHeader className="sticky top-0 bg-primary-foreground">
      <TableRow className="!border-b-0 text-xs">
        {columns
          .filter((column) => ['Date', 'Campaign', ...shownColumns].includes(column.header))
          .map((column, index) => (
            <TableCell
              key={index}
              className={cn('!border-b-0 py-1', column.footerClassName)}
            >
              {column.footerAccessor && column.footerAccessor(row as unknown as ReportDataRow)}
            </TableCell>
          ))}
      </TableRow>
      <TableRow>
        {columns
          .filter((column) => ['Date', 'Campaign', ...shownColumns].includes(column.header))
          .map((column, index) => (
            <TableHead
              key={index}
              className={cn(column.headerClassName)}
            >
              {column.header}
            </TableHead>
          ))}
      </TableRow>
    </TableHeader>
  );
}

export { OutputTable };
