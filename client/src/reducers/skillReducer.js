import * as types from '../actions/actionTypes';


import initialState from './initialState';

export default function skillReducer(state = initialState.skills, action) {
    switch (action.type) {
        case types.CREATE_SKILL:
            return [...state,
            Object.assign({}, action.skill)
            ];
        case types.UPDATE_SKILL:
            return [...state.filter(skill=>skill.id !==action.skill.id),
            Object.assign({}, action.skill)
            ];
        case types.LOAD_SKILLS_SUCCESS:
            return action.skills;
        default:
            return state;

    }
}
