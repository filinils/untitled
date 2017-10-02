import * as types from "./actionTypes";
import dc from "../data/datacontext";

export function createPerson(person) {
  return { type: types.CREATE_PERSON, person };
}
export function updatePerson(person) {
  return { type: types.UPDATE_PERSON, person };
}
export function loadPersonsSuccess(persons) {
  return { type: types.LOAD_PERSONS_SUCCESS, persons };
}

export function loadPersons() {
  return function(dispatch) {
    const instance = dc();

    return instance.person.getAll().then(persons => {
      if (persons) {
        dispatch(loadPersonsSuccess(persons));
      }
    });
  };
}
export function savePerson(person) {
  return function(dispatch) {
    const instance = dc();
    if (!person.id) {
      return instance.person.add(person).then(savedPerson => {
        dispatch(createPerson(savedPerson));
      });
    } else {
      return instance.person.update(person).then(() => {
        dispatch(updatePerson(person));
      });
    }
  };
}
