'use client';

import * as React from 'react';

import { Settings2, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '~/components/ui/select';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';

const stringColumns = ['name'] as const;
const numberColumns = [
  'spend',
  'revenue',
  'margin',
  'roi',
  'impressions',
  'clicks',
  'views',
  'ad_clicks',
  // 'ctr',
  // 'cpc',
  // 'rpv',
  'cpac',
  'rpac',
] as const;
const stringOperators = ['equals', 'contains', 'in_list', 'not_equals', 'not_contains', 'not_in_list'] as const;
const numberOperators = [
  'equals',
  'not_equals',
  'greater_than',
  'less_than',
  'greater_than_or_equals',
  'less_than_or_equals',
] as const;

export type BaseFilter = {
  level: 'campaign' | 'adset' | 'ad';
};

export type StringColumn = (typeof stringColumns)[number];
export type StringOperator = (typeof stringOperators)[number];
export type StringFilter = BaseFilter & {
  operator: StringOperator;
  column: StringColumn;
  value: string;
};

export type NumberColumn = (typeof numberColumns)[number];
export type NumberOperator = (typeof numberOperators)[number];
export type NumberFilter = BaseFilter & {
  operator: NumberOperator;
  column: NumberColumn;
  value: number;
};

const columnLabels: Record<StringColumn | NumberColumn, string> = {
  name: 'Name',
  spend: 'Spend',
  revenue: 'Revenue',
  margin: 'Margin',
  roi: 'ROI',
  impressions: 'Impressions',
  clicks: 'Clicks',
  views: 'Views',
  ad_clicks: 'Ad Clicks',
  // ctr: 'CTR',
  // cpc: 'CPC',
  // rpv: 'RPV',
  cpac: 'CPAC',
  rpac: 'RPAC',
};
const operatorLabels: Record<StringOperator | NumberOperator, string> = {
  equals: 'Equals',
  not_equals: 'Not Equals',
  greater_than: 'Greater Than',
  less_than: 'Less Than',
  greater_than_or_equals: 'Greater Than or Equals',
  less_than_or_equals: 'Less Than or Equals',
  contains: 'Contains',
  not_contains: 'Not Contains',
  in_list: 'In List',
  not_in_list: 'Not In List',
};
const textAreaOperators: StringOperator[] = ['in_list', 'not_in_list'];

export default function Filtering({
  defaultFilters,
  onFiltersChange,
}: {
  defaultFilters: (StringFilter | NumberFilter)[];
  onFiltersChange: (filters: (StringFilter | NumberFilter)[]) => void;
}) {
  const [appliedFilters, setAppliedFilters] = React.useState<(StringFilter | NumberFilter)[]>(defaultFilters);
  const [addFilterLevel, setAddFilterLevel] = React.useState<'campaign' | 'adset' | 'ad' | ''>('');
  const [addFilterColumn, setAddFilterColumn] = React.useState<StringColumn | NumberColumn | ''>('');
  const [addFilterOperator, setAddFilterOperator] = React.useState<string>('');
  const [addFilterValue, setAddFilterValue] = React.useState('');

  React.useEffect(() => {
    setAddFilterColumn('');
  }, [addFilterLevel]);

  React.useEffect(() => {
    setAddFilterOperator('');
  }, [addFilterColumn]);

  React.useEffect(() => {
    setAddFilterValue('');
  }, [addFilterOperator]);

  React.useEffect(() => {
    onFiltersChange(appliedFilters);
  }, [appliedFilters, onFiltersChange]);

  return (
    <Dialog onOpenChange={() => setAddFilterLevel('')}>
      <DialogTrigger asChild>
        <Button
          className="gap-1"
          size="sm"
          variant="outline"
        >
          <Settings2 size={16} />
          <span>Filters</span>
          {appliedFilters.length > 0 && <span className="text-indigo-500">({appliedFilters.length} active)</span>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-md font-semibold">Active Filters</h2>
          <div className="flex flex-col gap-1">
            {appliedFilters.map((filter, index) => (
              <div
                className="flex w-full items-center justify-between gap-1"
                key={index}
              >
                <div className="flex flex-row items-center gap-2">
                  <Badge variant="secondary">
                    {`${filter.level === 'campaign' ? 'Campaign' : filter.level === 'adset' ? 'Adset' : 'Ad'} ${columnLabels[filter.column] || filter.column}`}
                  </Badge>
                  <Badge>{operatorLabels[filter.operator] || filter.operator}</Badge>
                  <Badge
                    title={filter.value.toString()}
                    variant="outline"
                    className="line-clamp-1 max-w-48 cursor-pointer"
                  >
                    {filter.value}
                  </Badge>
                </div>
                <Button
                  onClick={() => {
                    setAppliedFilters(appliedFilters.filter((_, i) => i !== index));
                  }}
                  variant="ghost"
                  size="icon"
                  className="size-8 hover:bg-red-500/25 hover:text-red-500"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            {appliedFilters.length === 0 && <span className="text-sm text-muted-foreground">No active filters</span>}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-md font-semibold">Add Filters</h2>
          <div className="grid gap-1.5">
            <Label>Filter level</Label>
            <Select
              value={addFilterLevel}
              onValueChange={(value) => {
                if (['campaign', 'adset', 'ad'].includes(value as 'campaign' | 'adset' | 'ad'))
                  return setAddFilterLevel(value as 'campaign' | 'adset' | 'ad');
                setAddFilterLevel('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="adset">Adset</SelectItem>
                <SelectItem value="ad">Ad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {addFilterLevel && (
            <div className="grid gap-1.5">
              <Label>Filter by</Label>
              <Select
                value={addFilterColumn ?? undefined}
                onValueChange={(value) => {
                  if ([...stringColumns, ...numberColumns].includes(value as StringColumn | NumberColumn))
                    setAddFilterColumn(value as StringColumn | NumberColumn);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {stringColumns.map((column) => (
                    <SelectItem
                      key={column}
                      value={column}
                    >
                      {columnLabels[column] || column}
                    </SelectItem>
                  ))}
                  {numberColumns.map((column) => (
                    <SelectItem
                      key={column}
                      value={column}
                    >
                      {columnLabels[column] || column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {addFilterColumn && (
            <div className="grid gap-1.5">
              <Label>Operator</Label>
              <Select
                value={addFilterOperator}
                onValueChange={setAddFilterOperator}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an operator" />
                </SelectTrigger>
                <SelectContent>
                  {stringColumns.includes(addFilterColumn as StringColumn)
                    ? stringOperators.map((col) => (
                        <SelectItem
                          key={col}
                          value={col}
                        >
                          {operatorLabels[col] || col}
                        </SelectItem>
                      ))
                    : numberColumns.includes(addFilterColumn as NumberColumn)
                      ? numberOperators.map((col) => (
                          <SelectItem
                            key={col}
                            value={col}
                          >
                            {operatorLabels[col] || col}
                          </SelectItem>
                        ))
                      : null}
                </SelectContent>
              </Select>
            </div>
          )}
          {addFilterOperator && (
            <div className="grid gap-1.5">
              <Label>Value</Label>
              {textAreaOperators.includes(addFilterOperator as StringOperator) ? (
                <Textarea
                  value={addFilterValue}
                  onChange={(e) => setAddFilterValue(e.target.value)}
                  placeholder="Enter values (one per line)"
                />
              ) : (
                <Input
                  value={addFilterValue}
                  onChange={(e) => setAddFilterValue(e.target.value)}
                  type={numberColumns.includes(addFilterColumn as NumberColumn) ? 'number' : 'text'}
                  placeholder="Enter a value"
                />
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              onClick={() => {
                const isStringColumn = stringColumns.includes(addFilterColumn as StringColumn);
                const newFilter = isStringColumn
                  ? ({
                      column: addFilterColumn as StringColumn,
                      operator: addFilterOperator as StringOperator,
                      value: addFilterValue,
                      level: addFilterLevel,
                    } as StringFilter)
                  : ({
                      column: addFilterColumn as NumberColumn,
                      operator: addFilterOperator as NumberOperator,
                      value: parseFloat(addFilterValue),
                      level: addFilterLevel,
                    } as NumberFilter);

                setAppliedFilters([...appliedFilters, newFilter]);
                setAddFilterColumn('');
                setAddFilterOperator('');
                setAddFilterValue('');
              }}
              disabled={
                !addFilterColumn ||
                !addFilterOperator ||
                !addFilterValue ||
                (textAreaOperators.includes(addFilterOperator as StringOperator) &&
                  addFilterValue.split('\n').filter((v) => v.trim() !== '').length === 0)
              }
            >
              Add Filter
            </Button>
            <DialogClose asChild>
              <Button
                size="sm"
                variant="secondary"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
