import App from "./components/App";
import StartPage from "./components/pages/start/StartPage";

import ThreeViewer from "./components/pages/ThreeViewer/ThreeViewer";

const routes = [
  {
    path: "/",
    component: App,
    routes: [
      {
        title: "Start",
        path: "/start",
        component: StartPage
      },

      {
        title: "3D",
        path: "/threeviewer",
        component: ThreeViewer
      }
    ]
  }
];
export { routes };
