'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/ui/molecules';

type ClinicalHistoryFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClear?: () => void;
};

export function ClinicalHistoryFilters({
  search,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
}: ClinicalHistoryFiltersProps) {
  const t = useTranslations();
  const hasFilters = search !== '' || dateFrom !== '' || dateTo !== '';

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-full min-w-[200px] max-w-sm">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t('clinicalHistories.searchPlaceholder')}
          className="w-full"
        />
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor="clinical-history-date-from" className="text-xs">
            {t('clinicalHistories.dateFrom')}
          </Label>
          <Input
            id="clinical-history-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-[140px]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="clinical-history-date-to" className="text-xs">
            {t('clinicalHistories.dateTo')}
          </Label>
          <Input
            id="clinical-history-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-[140px]"
          />
        </div>
      </div>
      {hasFilters && onClear && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          data-testid="clinical-history-filters-clear"
        >
          {t('clinicalHistories.clearFilters')}
        </Button>
      )}
    </div>
  );
}
