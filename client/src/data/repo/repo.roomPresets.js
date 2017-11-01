import _room1 from '../mockup/roomData01';
import  _room2 from '../mockup/roomData02';

export default () => {

    function getAll() {
        return Promise.resolve(
          [
            JSON.parse(_room1),
            JSON.parse(_room2),
          ]
        );
    }

    return {getAll}

};
