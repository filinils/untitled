import * as types from '../actions/actionTypes';

import initialState from './initialState';

export default function roomPresetsReducer(state = initialState.roomPresets, action) {
    switch (action.type) {
        case types.LOAD_PRESETS_SUCCESS:
            return action.presets;
        default:
            return state;

    }
}
