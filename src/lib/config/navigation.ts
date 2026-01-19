import { LayoutDashboard, Users, Calendar, FileText, Settings } from 'lucide-react';

export type NavItem = {
  titleKey: string;
  href: string;
  icon: typeof LayoutDashboard;
  children?: { titleKey: string; href: string }[];
};

export const sidebarNavItems: NavItem[] = [
  {
    titleKey: 'navigation.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    titleKey: 'navigation.patients',
    href: '/patients',
    icon: Users,
    children: [
      { titleKey: 'patients.title', href: '/patients' },
      { titleKey: 'patients.newPatient', href: '/patients/new' },
    ],
  },
  {
    titleKey: 'navigation.appointments',
    href: '/appointments',
    icon: Calendar,
    children: [
      { titleKey: 'appointments.title', href: '/appointments' },
      { titleKey: 'appointments.newAppointment', href: '/appointments/new' },
    ],
  },
  {
    titleKey: 'navigation.clinicalHistories',
    href: '/clinical-histories',
    icon: FileText,
  },
  {
    titleKey: 'navigation.settings',
    href: '/settings',
    icon: Settings,
  },
];
