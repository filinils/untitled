import * as types from '../actions/actionTypes';

import initialState from './initialState';

export default function roomPresetsReducer(state = initialState.roomPresets, action) {
    switch (action.type) {
        case types.LOAD_PRESETS_SUCCESS:
            return action.presets;
      case types.ADD_PRESET:
        let newState = [...state];
        newState.push(action.preset);
        return newState;
        default:
            return state;

    }
}
