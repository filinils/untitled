import axios from 'axios';
import * as endpoints from './endpoints';
export default () => {

    function getAll() {

        return new Promise((resolve, reject) => {

            return axios.get(endpoints.skill).then(skill => {
                resolve(skill.data);

            }).catch(error => {
                console.log(error, 'An error occured');
                reject(error);

            });
        });







    }

    function add(skill) {

        return new Promise((resolve, reject) => {



        });



    }

    function update(skill) {
        return new Promise((resolve, reject) => {




        });



    }

    return {
        getAll,
        add,
        update

    };
};
