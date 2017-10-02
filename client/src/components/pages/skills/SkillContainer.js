import React from 'react';
import RouteWithSubRoutes from '../../../config/RouteWithSubRoutes';


class SkillContainer extends React.Component {

    render(){
        return(
        <div className="layout-content">

    <h1>Skills</h1>



  {this.props.routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
        </div>);
    }
}

export default SkillContainer;
