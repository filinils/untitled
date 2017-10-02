import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';



class SubNav extends React.Component {

    constructor(props){
        super(props);
        this.state ={ links:this.props.subNodes};

        this.createLinks = this.createLinks.bind(this);


    }

componentWillReceiveProps(nextProps){

  if(nextProps.subNodes !== this.props.subNodes){
    this.setState({links:nextProps.subNodes});
  }
}


    createLinks(link){
             return <li className="component-subnav subnav-list subnav-listitem" key={link.title}><Link to={link.path}>{link.title}</Link></li>;

    }


    render(){
        return (
            <div className="layout-subnav">

            <ul className="component-subname subnav-list">{this.state.links.map(this.createLinks)}</ul>
            </div>);




    }
}

export default SubNav;
