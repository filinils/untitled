import React from 'react'; 
import PropTypes from 'prop-types'; 
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import * as personActions from '../../../actions/personActions';



class PlanPage extends React.Component {

    constructor(props){
        super(props);
        this.redirectToAddPlan = this.redirectToAddPerson.bind();

    }

     personRow(person,index){
        return <li key={index}><Link to={'/person/'+person.id}>{person.name}</Link></li>;
    }

    redirectToAddPerson(){
      
    }
    render() {
        return (
            <div className="layout-content">

                <h2>Persons</h2>
                <input
                    type="submit"
                    value="Add person"
                    onClick={this.redirectToAddPerson}
                    />

                <ul>
                   {this.props.persons.map(this.personRow)}
                </ul>


            </div>


        );
    }
}
PlanPage.propTypes  ={
    persons:PropTypes.array.isRequired
};
function mapStateToProps(state, ownProps) {
    return {
        persons: state.persons
    };
}


export default connect(mapStateToProps)(PlanPage);
