import { combineReducers } from "redux";
import persons from "./personReducer";
import articles from "./articleReducer";

const rootReducer = combineReducers({
	persons,
	articles
});

export default rootReducer;
