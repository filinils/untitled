import { combineReducers } from "redux";
import persons from "./personReducer";
import roomPresets from "./roomPresetsReducer";
import room from "./roomReducer";

const rootReducer = combineReducers({
  persons,
  roomPresets,
  room
});

export default rootReducer;
