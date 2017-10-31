import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as roomActions from '../../../actions/roomActions';
import * as _ from 'lodash';

class StartPage extends React.Component {
  constructor(props) {
    super(props);

  }

  setRoom(room){
    this.props.roomActions.setRoom(room);
    this.props.history.push(_.find(this.props.routes,route=>route.title==='Planner').path);
  }

  renderPresets(){
    let presets = this.props.roomPresets;
    if(!presets.length) return null;
    return _.map(presets,(item,index)=>{
      return (
        <div  key={index}>
          <a onClick={()=>this.setRoom(item)}>{`preset index: ${index}`}</a>
      </div>
      );
    });
  }
  render() {
    return (
      <div className="layout-content">
        <p>Select your room preset</p>
        {this.renderPresets()}
      </div>
    );
  }
}


//store config
function mapStateToProps(state, ownProps) {
  return {
    room: state.room,
    roomPresets:state.roomPresets
  };


}
function mapDispatchToProps(dispatch) {
  return {
    roomActions: bindActionCreators(roomActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);




