'use client';

import { useState } from 'react';
import { Sidebar, MobileSidebar, Header } from '@/ui/organisms';
import type { BreadcrumbItemData } from '@/ui/molecules';

type DashboardLayoutProps = {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItemData[];
};

export function DashboardLayout({ children, breadcrumbs }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
