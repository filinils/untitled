
import person from './repo.person';
import skill from './repo.skill';



let repos = [];

repos['person'] = person;
repos['skill'] = skill;




const repo = (repoName)=>{       
    return repos[repoName]();
};

export default repo;
