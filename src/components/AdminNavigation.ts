// src/components/AdminNavigation.ts
import { MenuItem } from '../types/types';
import AdminDashboard from '../pages/admin/Dashboard';
import SystemLog from '../pages/admin/SystemLog';
import UserManage from '../pages/admin/UserManage';

export const adminMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: 'dashboard',
    component: AdminDashboard,
    isAdmin: true,
  },
  {
    label: 'User Management',
    path: 'users',
    component: UserManage,
    isAdmin: true,
  },
  {
    label: 'System Log',
    path: 'logs',
    component: SystemLog,
    isAdmin: true,
  },
];
