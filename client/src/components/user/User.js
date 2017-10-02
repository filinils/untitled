import React from 'react'; 
import PropTypes from 'prop-types';






export default class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isLoggedIn: false, user: {} };
        
        this.checkUser = this.checkUser.bind(this);
        this.checkUser();

    }



    checkUser() {

        this.userCache.getUser().then((user) => {

            if (user) {
                this.setState({ isLoggedIn: true, user: user });
            }

        });

    }


    render() {

        const isLoggedIn = this.state.isLoggedIn;
        const user = this.state.user;

        let context = null;
        if (!isLoggedIn) {
            context = (<div className="component-user component-user-notloggedin heading ">
                <a href="http://localhost:8050/auth/provider">Log In</a>

            </div>);

        } else {
            context = (<div className="component-user component-user-loggedin">
                <h4 className="component-user heading"><i className="fa fa-user-o" aria-hidden="true"></i> {this.state.user.username}
                </h4>
                <a href="http://localhost:8050/logout">Log out</a>
            </div>);
        }
        return (

            <div className="component-usercontext">
                {context}
            </div>





        );
    }
}



