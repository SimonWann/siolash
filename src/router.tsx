import { createBrowserRouter, RouteObject } from "react-router-dom";
import Logs from "./routes/Logs";
import Connections from "./routes/Connections";
import Proxies from "./routes/Proxies";
import Root from "./routes/Root";
import Rules from "./routes/Rules";
import Settings from "./routes/Settings";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/connections',
        element: <Connections></Connections>
      },
      {
        path: '/logs',
        element: <Logs></Logs>
      },
      {
        path: '/proxies',
        element: <Proxies></Proxies>
      },
      {
        path: '/rules',
        element: <Rules></Rules>
      },
      {
        path: '/settings',
        element: <Settings></Settings>
      },
    ]
  }
]

export const router = createBrowserRouter(routes)

function SerializeRoutes(routes: RouteObject[]): any[] {
  return routes.map(route => {
    if((route.children?.length ?? 0) > 0) {
      return {path: route.path}
    } else {
      return SerializeRoutes(route.children ?? [])
    }
  })
}