import App from "./components/App";
import StartPage from "./components/pages/start/StartPage";

import ThreeViewer from "./components/pages/ThreeViewer/ThreeViewer";
import PlannerExample from "./components/pages/PlannerExample/PlannerExample";
import ViewerFloorPlanner from "./components/pages/PlannerExample/ViewerFloorPlanner";

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
			},
			{
				title: "2D Planner",
				path: "/2d-planner",
				component: ViewerFloorPlanner
			},
			{
				title: "Planner",
				path: "/planner",
				component: PlannerExample
			}
		]
	}
];
export { routes };
