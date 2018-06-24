const remoteProjectOwner = 'JaeYeopHan';
const remoteProjectName = 'toy-project-template';

module.exports = {
  getRemoteURL: (options = { branchName: 'es6+' }) => {
    return `git+https://github.com/${remoteProjectOwner}/${remoteProjectName}.git#${
      options.branchName
    }`;
  },
  localPath: `./node_modules/${remoteProjectName}/template`,
};
