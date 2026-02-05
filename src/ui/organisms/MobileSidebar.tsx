'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

type MobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar collapsed={false} />
      </SheetContent>
    </Sheet>
  );
}
