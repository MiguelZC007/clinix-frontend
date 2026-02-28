import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@/__tests__/test-utils';
import { DateRangeFilters } from '../DateRangeFilters';

describe('DateRangeFilters', () => {
  it('renderiza los dos inputs de fecha', () => {
    render(
      <DateRangeFilters
        dateFrom=""
        dateTo=""
        onDateFromChange={vi.fn()}
        onDateToChange={vi.fn()}
        dateFromLabel="Desde"
        dateToLabel="Hasta"
        idPrefix="test"
      />
    );
    expect(screen.getByLabelText('Desde')).toBeInTheDocument();
    expect(screen.getByLabelText('Hasta')).toBeInTheDocument();
  });

  it('muestra los valores iniciales', () => {
    render(
      <DateRangeFilters
        dateFrom="2024-01-15"
        dateTo="2024-01-31"
        onDateFromChange={vi.fn()}
        onDateToChange={vi.fn()}
        dateFromLabel="Desde"
        dateToLabel="Hasta"
        idPrefix="test"
      />
    );
    const from = screen.getByLabelText('Desde') as HTMLInputElement;
    const to = screen.getByLabelText('Hasta') as HTMLInputElement;
    expect(from.value).toBe('2024-01-15');
    expect(to.value).toBe('2024-01-31');
  });

  it('llama onDateFromChange al cambiar fecha desde', () => {
    const onDateFromChange = vi.fn();
    render(
      <DateRangeFilters
        dateFrom=""
        dateTo=""
        onDateFromChange={onDateFromChange}
        onDateToChange={vi.fn()}
        dateFromLabel="Desde"
        dateToLabel="Hasta"
        idPrefix="test"
      />
    );
    const from = screen.getByLabelText('Desde');
    fireEvent.change(from, { target: { value: '2024-01-01' } });
    expect(onDateFromChange).toHaveBeenCalledWith('2024-01-01');
  });
});
