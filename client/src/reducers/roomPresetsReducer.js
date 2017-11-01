import * as types from '../actions/actionTypes';
import * as _ from 'lodash'

import initialState from './initialState';

export default function roomPresetsReducer(state = initialState.roomPresets, action) {
    switch (action.type) {
        case types.LOAD_PRESETS_SUCCESS:
            return action.presets;
      case types.ADD_PRESET:
        let newState = [...state];
        newState = _.filter(newState,item=>item.id !== action.room.id);
        newState.push(action.room);
        return newState;
        default:
            return state;

    }
}

