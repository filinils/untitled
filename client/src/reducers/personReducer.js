import * as types from '../actions/actionTypes';


import initialState from './initialState';

export default function personReducer(state = initialState.persons, action) {
    switch (action.type) {
        case types.CREATE_PERSON:
            return [...state,
            Object.assign({}, action.person)
            ];
        case types.UPDATE_PERSON:
            return [...state.filter(person=>person.id !==action.person.id),
            Object.assign({}, action.person)
            ];
        case types.LOAD_PERSONS_SUCCESS:
            return action.persons;
        default:
            return state;

    }
}
