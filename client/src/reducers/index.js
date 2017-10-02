import {combineReducers} from 'redux';
import persons from './personReducer';
import skills from './skillReducer';


const rootReducer = combineReducers({
    persons,
    skills
});

export default rootReducer;
