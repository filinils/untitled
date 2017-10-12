export default () => {
  let callbacks = [];

  function fire(arg1, arg2) {
    callbacks.forEach(callback => {
      callback(arg1, arg2);
    });
  }
  function add(callback) {
    callbacks.push(callback);
  }

  function remove(callback) {
    let index = callbacks.indexOf(callback);

    callbacks = callbacks.splice(index, 1);
  }

  return {
    fire,
    add,
    remove
  };
};
