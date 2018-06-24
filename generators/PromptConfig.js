const ProjectName = require('./app/ProjectName');

module.exports = {
  projectName: {
    type: 'input',
    name: 'projectName',
    message: 'The project name: ',
    default: null,
    validate: ProjectName.validate,
  },

  projectTypeList: {
    type: 'list',
    name: 'projectType',
    message: 'Select the project type',
    choices: [
      {
        name: 'es6+ project (#es6+)',
        value: 'es6+',
      },
      {
        name: 'typescript project (#ts)',
        value: 'ts',
      },
      {
        name: 'Input the branch name >',
        value: '',
      },
    ],
    default: 'master',
  },
};
