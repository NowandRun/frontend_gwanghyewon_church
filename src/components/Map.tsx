import Friday from "../pages/common/Broadcast/child/Friday";
import Special from "../pages/common/Broadcast/child/Special";
import Worship from "../pages/common/Broadcast/child/Worship";
import BibleStudy from "../pages/common/Group/child/Bible-Study";
import CellLeader from "../pages/common/Group/child/Cell-leader";
import GrowthClass from "../pages/common/Group/child/Growth-Class";
import Intercession from "../pages/common/Group/child/Intercession";
import NewPeople from "../pages/common/Group/child/NewPeople";
import Home from "../pages/common/Home";
import Guide from "../pages/common/Info/child/Guide";
import Location from "../pages/common/Info/child/Location";
import Album from "../pages/common/News/child/Album";
import News from "../pages/common/News/News";
import Elementary from "../pages/common/Youth/child/Elementary";
import Students from "../pages/common/Youth/child/Student";
import YoungAdult from "../pages/common/Youth/child/Young-Adult";
import Greeting from "../pages/common/Info/child/Greeting";
import Minister from "../pages/common/Info/child/Minister";
import Info from "../pages/common/Info/Info";
import Youth from "../pages/common/Youth/Youth";
import Broadcast from "../pages/common/Broadcast/Broadcast";
import Group from "../pages/common/Group/Group";
import Bulletin from "../pages/common/News/child/Bulletin";
import Online from "../pages/common/Offering/child/Online";
import Tidings from "../pages/common/News/child/Knell";
import Offering from "../pages/common/Offering/Offering";
import YouTubeChannelInfo from "../data/youtube/YouTubeData";


export const componentMap: Record<string, React.ComponentType<any>> = {
  '/': Home,

  info: Info,
  'info/': Greeting,
  'info/minister': Minister,
  'info/guide': Guide,
  'info/location': Location,

  youth: Youth,
  'youth/': Elementary,
  'youth/students': Students,
  'youth/young-adult': YoungAdult,

  broadcast: Broadcast,
  'broadcast/': Worship,
  'broadcast/friday': Friday,
  'broadcast/special': Special,

  group: Group,
  'group/': NewPeople,
  'group/worship': GrowthClass,
  'group/nurture': BibleStudy,
  'group/baptism': CellLeader,
  'group/ministration': Intercession,

  news: News,
  'news/': Tidings,
  'news/album': Album,
  'news/bulletin': Bulletin,

  offering: Offering,
  'offering/': Online,
};
