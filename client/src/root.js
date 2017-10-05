import "babel-polyfill";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { routes } from "./routes";
import { loadPersons } from "./actions/personActions";

import App from "./components/App";
import configuerStore from "./store/configureStore";
import RouteWithSubRoutes from "./config/RouteWithSubRoutes";

// Stylesheets
require("../style/index.scss");

const store = configuerStore();
//store.dispatch(loadPersons());

const Routes = ({ routes }) => {
  return (
    <div>
      {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
    </div>
  );
};

const Root = () => (
  <Provider store={store}>
    <Router>
      <Routes routes={routes} />
    </Router>
  </Provider>
);

export default Root;
