import ActiveSessionsComponent from "../views/active-sessions-view/ActiveSessionsViewComponent";
import ArchivedSessionsComponent from "../views/archived-sessions-view/ArchivedSessionsViewComponent";
import LogRoomViewComponent from "../views/log-room-view/LogRoomViewComponent";

import SessionsGuardComponent from "../components/sessions-guard/SessionsGuardComponent";

import {ACTIVE_SESSIONS_PAGE, ARCHIVE_SESSIONS_PAGE, LOG_ROOM_PAGE} from "./pages";

const routes = [
  {
    path: '',
    component: SessionsGuardComponent,
    children: [
      {
        name: ACTIVE_SESSIONS_PAGE,
        path: '',
        component: ActiveSessionsComponent
      },
      {
        name: ARCHIVE_SESSIONS_PAGE,
        path: '/archive',
        component: ArchivedSessionsComponent
      }
    ]
  },
  {
    name: LOG_ROOM_PAGE,
    path:'/log-room/:id',
    component: LogRoomViewComponent,
    props: { merkerId: false }
  }
];

export {routes};