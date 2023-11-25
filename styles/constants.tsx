import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: <Icon icon="ph:user" />,
  },
  {
    title: 'Classes',
    path: '/dashboard/kelas-latihan',
    icon: <Icon icon="material-symbols-light:exercise-outline" />,
  },
  {
    title: 'Payments',
    path: '/dashboard/payments',
    icon: <Icon icon="solar:hand-money-broken" />,
  }
];