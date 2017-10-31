import * as types from '../actions/actionTypes';


import initialState from './initialState';

export default function personReducer(state = initialState.room, action) {
  let newState = Object.assign({},state);
    switch (action.type) {
        case types.ADD_ITEM:
          newState.items.push(action.item);
           return newState;
        case types.REMOVE_ITEM:
          let filtered = newState.items.filter(item=>item.name===action.item.name)
          newState.items = filtered;
          return newState;
        case types.SET_ROOM:
            return action.room;
        default:
            return state;

    }
}
