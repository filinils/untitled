import React, { PropTypes } from 'react';
import RouteWithSubRoutes from '../config/RouteWithSubRoutes';

import Nav from '../components/navigation/Nav';

class App extends React.Component {




  render() {
    return (

      <div className="layout-site">
        
       <Nav {...this.props} />
  
      
        
        <div className="layout-content">
         {this.props.routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
        </div>

      </div>
    );
  }

}




export default App;
