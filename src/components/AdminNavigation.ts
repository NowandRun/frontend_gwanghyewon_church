// src/components/AdminNavigation.ts
import { MenuItem } from '../types/types';
import ChurchInformationBoard from '../pages/admin/Church-Information/FindAllChurchInformationBoard';
import ChurchAlbumBoard from '../pages/admin/Church-Album/FindAllChurchAlbumBoard';
import ChurchBulletinBoard from '../pages/admin/Church-Bulletin/FindAllChurchBulletinBoard';
import MainPopupBoard from '../pages/admin/Main-Popup/FindAllMainPopupBoard';
import StorageGauge from '../pages/admin/Admin-Board-Page/AdminBoardPage';

export const adminMenuItems: MenuItem[] = [
  {
    label: 'Admin Board',
    path: 'admin-board',
    component: StorageGauge,
    isAdmin: true,
  },
  {
    label: 'Church Information',
    path: 'church-info',
    component: ChurchInformationBoard,
    isAdmin: true,
  },
  {
    label: 'Church Album',
    path: 'church-album',
    component: ChurchAlbumBoard,
    isAdmin: true,
  },
  {
    label: 'Church Bulletin',
    path: 'church-bulletin',
    component: ChurchBulletinBoard,
    isAdmin: true,
  },
  {
    label: 'Main Popup',
    path: 'main-popup',
    component: MainPopupBoard,
    isAdmin: true,
  },
];
