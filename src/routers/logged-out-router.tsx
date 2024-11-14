import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../Root';
import Home from '../pages/common/Home';
import Info from '../pages/common/Info/Info';
import Ministro from '../pages/common/Ministro/Ministro';
import Sermon from '../pages/common/Sermon/Sermon';
import Youth from '../pages/common/Youth/Youth';
import Missionary from '../pages/common/Missionary/Missionary';
import News from '../pages/common/News/News';
import Group from '../pages/common/Group/Group';
import Greeting from '../pages/common/Info/child/Greeting';
import Guide from '../pages/common/Info/child/Guide';
import Location from '../pages/common/Info/child/Location';
import Invite from '../pages/common/Info/child/Invite';
import ChurchInfo from '../pages/common/Info/child/Church-Info';
import Elder from '../pages/common/Ministro/child/Elder';
import Deacons from '../pages/common/Ministro/child/Deacons';
import SeniorDeacons from '../pages/common/Ministro/child/Senior-Deacons';
import People from '../pages/common/Ministro/child/People';
import Proclaim from '../pages/common/Sermon/child/Proclaim';
import Wednesday from '../pages/common/Sermon/child/Wednesday';
import Friday from '../pages/common/Sermon/child/Friday';
import Special from '../pages/common/Sermon/child/Special';
import Elementary from '../pages/common/Youth/child/Elementary';
import Students from '../pages/common/Youth/child/Student';
import YoungAdult from '../pages/common/Youth/child/Young-Adult';
import NewPeople from '../pages/common/Group/child/NewPeople';
import GrowthClass from '../pages/common/Group/child/Growth-Class';
import BibleStudy from '../pages/common/Group/child/Bible-Study';
import CellLeader from '../pages/common/Group/child/Cell-leader';
import Intercession from '../pages/common/Group/child/Intercession';
import OverSeas from '../pages/common/Missionary/child/Overseas';
import Cambodia from '../pages/common/Missionary/child/overseaschild/Cambodia';
import Thailand from '../pages/common/Missionary/child/overseaschild/Thailand';
import Korea from '../pages/common/Missionary/child/Korea';
import Letters from '../pages/common/Missionary/child/Letters';
import Knell from '../pages/common/News/child/Knell';
import Album from '../pages/common/News/child/Album';
import Hospitality from '../pages/common/News/child/Hospitality';

const loggedOutRouter = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'info',
        element: <Info />,
        children: [
          {
            index: true,
            element: <ChurchInfo />,
          },
          {
            path: 'greeting',
            element: <Greeting />,
          },
          {
            path: 'guide',
            element: <Guide />,
          },
          {
            path: 'location',
            element: <Location />,
          },
          {
            path: 'invite',
            element: <Invite />,
          },
        ],
      },
      {
        path: 'ministro',
        element: <Ministro />,
        children: [
          {
            index: true,
            element: <People />,
          },
          {
            path: 'elder',
            element: <Elder />,
          },
          {
            path: 'deacons',
            element: <Deacons />,
          },
          {
            path: 'senior-deacons',
            element: <SeniorDeacons />,
          },
        ],
      },
      {
        path: 'sermon',
        element: <Sermon />,
        children: [
          {
            index: true,
            element: <Proclaim />,
          },
          {
            path: 'wednesday',
            element: <Wednesday />,
          },
          {
            path: 'friday',
            element: <Friday />,
          },
          {
            path: 'special',
            element: <Special />,
          },
        ],
      },
      {
        path: '/youth',
        element: <Youth />,
        children: [
          {
            index: true,
            element: <Elementary />,
          },
          {
            path: 'students',
            element: <Students />,
          },
          {
            path: 'young-adult',
            element: <YoungAdult />,
          },
        ],
      },
      {
        path: '/group',
        element: <Group />,
        children: [
          {
            index: true,
            element: <NewPeople />,
          },
          {
            path: 'growth-class',
            element: <GrowthClass />,
          },
          {
            path: 'bible-study',
            element: <BibleStudy />,
          },
          {
            path: 'cell-leader',
            element: <CellLeader />,
          },
          {
            path: 'intercession',
            element: <Intercession />,
          },
        ],
      },
      {
        path: '/missionary',
        element: <Missionary />,
        children: [
          {
            path: '',
            element: <OverSeas />,
            children: [
              {
                path: 'cambodia',
                element: <Cambodia />, // JSX로 감싸줘야 함
              },
              {
                path: 'thailand',
                element: <Thailand />, // JSX로 감싸줘야 함
              },
            ],
          },
          {
            path: 'korea',
            element: <Korea />,
          },
          {
            path: 'letters',
            element: <Letters />,
          },
        ],
      },
      {
        path: '/news',
        element: <News />,
        children: [
          {
            index: true,
            element: <Knell />,
          },
          {
            path: 'album',
            element: <Album />,
          },
          {
            path: 'hospitality',
            element: <Hospitality />,
          },
        ],
      },
    ],
  },
]);

export default loggedOutRouter;
