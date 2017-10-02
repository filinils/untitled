import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import * as skillActions from '../../../actions/skillActions';



class AddSkillPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            skills: this.props.skills ? this.props.skills : []
        };
        this.redirectToAddSkill = this.redirectToAddSkill.bind();

    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.skills !== this.props.skills) {
            this.setState({ skills: nextProps.skills });
        }
    }

    skillRow(skill, index) {
        return <li key={index}><Link to={'/skill/' + skill._id}>{skill.name}</Link></li>;
    }

    redirectToAddSkill() {

    }
    render() {
        return (
            <div className="layout-content">

                <h2>Add</h2>
                <input
                    type="submit"
                    value="Add skill"
                    onClick={this.redirectToAddSkill}
                />

                <ul>
                    {this.state.skills.map(this.skillRow)}
                </ul>


            </div>


        );
    }
}
AddSkillPage.propTypes = {
    skills: PropTypes.array.isRequired
};
function mapStateToProps(state, ownProps) {
    return {
        skills: state.skills
    };
}


export default connect(mapStateToProps)(AddSkillPage);
