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
        name: 'master (#master)',
        value: 'master',
      },
      {
        name: 'es6 plus (#es6p)',
        value: 'es6p',
      },
      {
        name: 'typescript (#ts)',
        value: 'typescript',
      },
      {
        name: 'Input the branch name >',
        value: '',
      },
    ],
    default: 'master',
  },
};
