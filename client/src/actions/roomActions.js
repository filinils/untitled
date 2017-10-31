import * as types from "./actionTypes";

export function addItem(item) {
  return { type: types.ADD_ITEM, item };
}

export function removeItem(item) {
  return { type: types.REMOVE_ITEM, item };
}

export function setRoom(room) {
  return { type: types.SET_ROOM, room };
}



