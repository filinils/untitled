import * as types from './actionTypes';
import dc from '../data/datacontext';

export function createSkill(skill) {
    return { type: types.CREATE_SKILL, skill };
}
export function updateSkill(skill) {
    return { type: types.UPDATE_SKILL, skill };
}
export function loadSkillsSuccess(skills) {
    return { type: types.LOAD_SKILLS_SUCCESS, skills };
}

export function loadSkills() {
    return function (dispatch) {

        const instance = dc();
        return instance.skill.getAll().then((skills) => {
            if (skills) {
                dispatch(loadSkillsSuccess(skills));
            }
        });
    };
}
export function saveSkill(skill) {
    return function (dispatch) {
        const instance = dc();
        if (!skill.id) {
            return instance.skill.add(skill).then((savedSkill) => {

                    dispatch(createSkill(savedSkill));

            });
        }
        else{

        return instance.skill.update(skill).then(() => {

                    dispatch(updateSkill(skill));

            });
        }



    };
}



