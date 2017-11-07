import React, { PropTypes } from "react";
import RouteWithSubRoutes from "../config/RouteWithSubRoutes";
import * as roomPresetsActions from '../actions/roomPresetsActions';

import Nav from "../components/navigation/Nav";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class App extends React.Component {

  componentDidMount(){
    this.props.roomPresetsActions.loadPresets();
  }


  render() {
    return (
      <div className="layout-site">
        <Nav {...this.props} />

        <div className="layout-content">
          {this.props.routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} {...this.props} />
          ))}
        </div>
      </div>
    );
  }
}


//store config
function mapStateToProps(state, ownProps) {
  return {

  };
}
function mapDispatchToProps(dispatch) {
  return {
    roomPresetsActions: bindActionCreators(roomPresetsActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);


