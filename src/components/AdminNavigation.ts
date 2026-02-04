// src/components/AdminNavigation.ts
import { MenuItem } from '../types/types';
import SystemLog from '../pages/admin/SystemLog';
import UserManage from '../pages/admin/UserManage';
import CreateCharchInformationBoard from '../pages/admin/Charch-Information/Charch-Information-Board-Create';
import CharchInformationBoard from '../pages/admin/Charch-Information/Charch-Information-Board';

export const adminMenuItems: MenuItem[] = [
  {
    label: 'Charch Information',
    path: 'charch-info',
    component: CharchInformationBoard,
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
