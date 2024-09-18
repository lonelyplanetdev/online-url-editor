'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onRangeSelect?: (dateRange: DateRange) => void;
}
export function DateRangePicker({ onRangeSelect, className }: DateRangePickerProps) {
  const pstDate = new Date(new Date().getTime() - 8 * 60 * 60 * 1000);
  const hereDate = new Date(pstDate.getUTCFullYear(), pstDate.getUTCMonth(), pstDate.getUTCDate());

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(hereDate, -8),
    to: addDays(hereDate, -1),
  });

  React.useEffect(() => {
    onRangeSelect && onRangeSelect(date || { from: hereDate, to: hereDate });
  }, [date]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            today={hereDate}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
