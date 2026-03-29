// src/components/AdminNavigation.ts
import { MenuItem } from '../types/types';
import ChurchInformationBoard from '../pages/admin/Church-Information/FindAllChurchInformationBoard';
import ChurchAlbumBoard from 'src/pages/admin/Church-Album/FindAllChurchAlbumBoard';
import ChurchBulletinBoard from 'src/pages/admin/Church-Bulletin/FindAllChurchBulletinBoard';
import MainPopupBoard from 'src/pages/admin/Main-Popup/FindAllMainPopupBoard';

export const adminMenuItems: MenuItem[] = [
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
