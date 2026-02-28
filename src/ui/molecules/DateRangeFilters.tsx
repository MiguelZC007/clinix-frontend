'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  return (
    <div className={cn('flex flex-wrap items-end gap-2', className)}>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-date-from`} className="text-xs">
          {dateFromLabel}
        </Label>
        <Input
          id={`${idPrefix}-date-from`}
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-[140px]"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-date-to`} className="text-xs">
          {dateToLabel}
        </Label>
        <Input
          id={`${idPrefix}-date-to`}
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-[140px]"
        />
      </div>
    </div>
  );
}
