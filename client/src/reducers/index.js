import { combineReducers } from "redux";
import persons from "./personReducer";

const rootReducer = combineReducers({
  persons
});

export default rootReducer;
