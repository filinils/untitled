import person from "./repo.person";
import roomPresets from "./repo.roomPresets";

let repos = [];

repos["person"] = person;
repos["roomPresets"] = roomPresets;

const repo = repoName => {
  return repos[repoName]();
};

export default repo;
