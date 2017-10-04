import App from "./components/App";
import StartPage from "./components/pages/start/StartPage";
import PersonPage from "./components/pages/person/PersonPage";
import AddSkillPage from "./components/pages/skills/AddSkillPage";
import SkillViewer from "./components/pages/skills/SkillViewer";
import ThreeViewer from "./components/pages/ThreeViewer/ThreeViewer";

import SkillContainer from "./components/pages/skills/SkillContainer";

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
        title: "Person",
        path: "/person",
        component: PersonPage
      },
      {
        title: "3D",
        path: "/threeviewer",
        component: ThreeViewer
      },

      {
        title: "Skills",
        path: "/skills",
        component: SkillContainer,
        routes: [
          {
            title: "Diagram",
            path: "/skills/diagram",
            component: SkillViewer
          },
          {
            title: "Add skill",
            path: "/skills/add",
            component: AddSkillPage
          }
        ]
      }
    ]
  }
];
export { routes };
