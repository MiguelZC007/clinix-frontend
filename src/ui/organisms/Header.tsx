'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BreadcrumbNav, type BreadcrumbItemData } from '@/ui/molecules';

type HeaderProps = {
  breadcrumbs: BreadcrumbItemData[];
  onMenuClick?: () => void;
  className?: string;
};

export function Header({ breadcrumbs, onMenuClick, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <BreadcrumbNav items={breadcrumbs} />
    </header>
  );
}
