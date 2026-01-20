import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import { MobileSidebar } from '../MobileSidebar';

describe('MobileSidebar', () => {
  it('renderiza cuando esta abierto', () => {
    render(<MobileSidebar open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Clínica San Miguel')).toBeInTheDocument();
  });

  it('no renderiza cuando esta cerrado', () => {
    render(<MobileSidebar open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText('Clínica San Miguel')).not.toBeInTheDocument();
  });

  it('llama onOpenChange al cerrar', async () => {
    const onOpenChange = vi.fn();
    render(<MobileSidebar open={true} onOpenChange={onOpenChange} />);
    const overlay = document.querySelector('[data-slot="sheet-overlay"]');
    if (overlay) {
      (overlay as HTMLElement).click();
    }
  });
});
