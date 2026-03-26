'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DateRangeFiltersProps = {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  dateFromLabel: string;
  dateToLabel: string;
  idPrefix: string;
  className?: string;
};

export function DateRangeFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  dateFromLabel,
  dateToLabel,
  idPrefix,
  className,
}: DateRangeFiltersProps) {
  const dateFromDate = dateFrom ? new Date(dateFrom) : undefined;
  const dateToDate = dateTo ? new Date(dateTo) : undefined;

  return (
    <div className={cn('flex flex-wrap items-end gap-2', className)}>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-date-from`} className="text-xs">
          {dateFromLabel}
        </Label>
        <div className="flex gap-1">
          <Input
            id={`${idPrefix}-date-from`}
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-[140px]"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="shrink-0">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFromDate}
                onSelect={(d) => d && onDateFromChange(d.toISOString().slice(0, 10))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-date-to`} className="text-xs">
          {dateToLabel}
        </Label>
        <div className="flex gap-1">
          <Input
            id={`${idPrefix}-date-to`}
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-[140px]"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="shrink-0">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateToDate}
                onSelect={(d) => d && onDateToChange(d.toISOString().slice(0, 10))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
