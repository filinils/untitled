import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import SubNav from './SubNav';
import { nodes } from '../../config/navigation';


class Nav extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            routes: this.props.routes || [],
            links: null,
            location: this.props.location.pathname || '',
            subNodes: []
        };

        this.createLinks = this.createLinks.bind(this);


    }


    componentDidMount() {
        this.createLinks();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({ routes: nextProps.routes, location: nextProps.location.pathname },()=>{
            this.createLinks();
            });
        }
    }



    createLinks() {
        const links = this.state.routes.map((node) => {

            let isActive = this.state.location.includes(node.path);
            if (isActive && node.routes)
                this.setState({ subNodes: node.routes });
            else
                this.setState({ subNodes: [] });

            let activeClass = isActive ? ' active' : '';

            let classes = 'component-navigation nav-list nav-listitem' + activeClass;
            return (<li className={classes} key={node.title}>
                <Link to={node.path}>{node.title}</Link></li>);
        });


        this.setState({ links: links });



    }


    render() {
        return (
            <div className="layout-head">
                <div className="component-navigation">

                    <ul className="component-navigation nav-list">{this.state.links}</ul>
                </div>

                <SubNav subNodes={this.state.subNodes} />
            </div>);






    }
}

export default Nav;
