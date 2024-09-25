'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The current date range value */
  dateRange?: DateRange;
  today?: Date;
  /** Callback when the date range changes */
  onDateRange?: (dateRange: DateRange | undefined) => void;
}

export function DatePickerWithRange({ dateRange, onDateRange, className, today, ...props }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(dateRange);

  React.useEffect(() => {
    setDate(dateRange);
  }, [dateRange]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onDateRange) {
      onDateRange(newDate);
    }
  };

  return (
    <div
      className={cn('grid gap-2', className)}
      {...props}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn('w-96 justify-start text-left font-normal', !date && 'text-muted-foreground')}
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
            today={today}
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
