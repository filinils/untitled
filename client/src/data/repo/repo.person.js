import axios from 'axios';
import * as endpoints from './endpoints';
export default () => {
 
    function getAll() {

        return new Promise((resolve, reject) => {
            
                return axios.get(endpoints.person).then(person => {
                    resolve(person.data);

                }).catch(error => {
                    console.log(error, 'An error occured');
                    reject(error);

                });
            });

   





    }

    function add(plan) {

        return new Promise((resolve, reject) => {
          


            });

      

    }

    function update(plan) {
   return new Promise((resolve, reject) => {
           


             
            });

      

    }

    return {
        getAll,
        add,
        update

    };
};
