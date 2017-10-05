import person from "./repo.person";

let repos = [];

repos["person"] = person;

const repo = repoName => {
  return repos[repoName]();
};

export default repo;
