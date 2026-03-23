import {
  UsersIcon,
  HouseIcon,
  MoneyIcon,
  GiftIcon,
  CloverIcon,
  TrophyIcon,
  ChatCircleTextIcon,
  IconProps,
} from '@phosphor-icons/react';
import React from 'react';

export interface SidebarItemData {
  id: number;
  href: string;
  Icon: React.ComponentType<IconProps>;
  label: string;
}

export const sidebarItems: SidebarItemData[] = [
  { id: 1, href: '/admin', Icon: HouseIcon, label: 'Dashboard' },
  { id: 2, href: '/admin/users', Icon: UsersIcon, label: 'Usuarios' },
  { id: 3, href: '/admin/lotteries', Icon: CloverIcon, label: 'Loterías' },
  { id: 4, href: '/admin/prizes', Icon: GiftIcon, label: 'Premios' },
  { id: 5, href: '/admin/winners', Icon: TrophyIcon, label: 'Ganadores' },
  { id: 7, href: '/admin/finance', Icon: MoneyIcon, label: 'Finanzas' },
  { id: 9, href: '/admin/testimonials', Icon: ChatCircleTextIcon, label: 'Reseñas' },
];
