import _room1 from '../mockup/roomData01';
import  _room2 from '../mockup/roomData02';

export default () => {

    function getAll() {
        return Promise.resolve(
          [
            _room1,
            _room2,
          ]
        );
    }

    return {getAll}

};
