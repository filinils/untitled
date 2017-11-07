import { combineReducers } from "redux";
import persons from "./personReducer";
import roomPresets from "./roomPresetsReducer";
import room from "./roomReducer";
import articles from "./articleReducer";

const rootReducer = combineReducers({
  persons,
  roomPresets,
  room,
  articles

});

export default rootReducer;
