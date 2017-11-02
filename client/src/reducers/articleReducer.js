import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState.articles, action) => {
	switch (action.type) {
		default:
			return state;
	}
};
