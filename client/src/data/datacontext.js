import repo from "./repo/repo.js";

const datacontext = () => {
  let repoNames = ["person", "skill", "leg"];

  let service = {};

  defineLazyLoadedRepos();

  return service;

  function defineLazyLoadedRepos() {
    repoNames.forEach(function(name) {
      Object.defineProperty(service, name, {
        configurable: true,
        get: function() {
          let thisRepo = repo(name);
          Object.defineProperty(service, name, {
            value: thisRepo,
            configurable: false,
            enumerable: true
          });
          return thisRepo;
        }
      });
    });
  }
};

export default datacontext;
