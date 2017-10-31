import * as types from "./actionTypes";
import dc from "../data/datacontext";

export function loadPresetsSuccess(presets) {
  return { type: types.LOAD_PRESETS_SUCCESS, presets };
}

export function loadPresets() {
  return function(dispatch) {
    const instance = dc();
    return instance.roomPresets.getAll().then(presets => {
      if (presets) {
        dispatch(loadPresetsSuccess(presets));
      }
    });
  };
}
