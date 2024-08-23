'use client';

import * as React from 'react';
import type { DateRange as ToolDateRange } from '../';
import { Label } from '~/components/ui/label';
import { DateRangePicker } from './date-range';
import { Input } from '~/components/ui/input';
import { DateRange } from 'react-day-picker';
import { ManagerMultiselect } from './manager-multiselect';
import { ColumnMultiselect } from './column-multiselect';

interface FilteringProps {
  onSearchName: (name: string | null) => void;
  onDateRange: (dateRange: ToolDateRange | null) => void;
  onMangersFilter: (managers: string[]) => void;
  onColumnsFilter: (columns: string[]) => void;
  managers: string[];
  columns: string[];
}
function Filtering({ onSearchName, onDateRange, onMangersFilter, onColumnsFilter, managers, columns }: FilteringProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>();
  const [searchName, setSearchName] = React.useState<string>('');

  React.useEffect(() => {
    onSearchName(searchName || null);
  }, [searchName]);

  React.useEffect(() => {
    if (!dateRange || !dateRange.from) onDateRange(null);
    else
      onDateRange({
        from: dateRange.from,
        to: dateRange.to || dateRange.from,
      });
  }, [dateRange]);

  return (
    <div className="grid">
      <div className="flex flex-col gap-2 xl:flex-row">
        <DateRangePicker
          className="w-full grow xl:basis-1/4"
          onRangeSelect={(range) => setDateRange(range)}
        />
        <Input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full grow xl:basis-1/4"
        />
        <ManagerMultiselect
          managers={managers}
          onManagersSelect={(selected) => {
            onMangersFilter(selected);
          }}
        />
        <ColumnMultiselect
          columns={columns}
          onColumnsSelect={(selected) => {
            onColumnsFilter(selected);
          }}
        />
      </div>
    </div>
  );
}

export { Filtering };
