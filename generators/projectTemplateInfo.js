// const remoteProjectOwner = 'JaeYeopHan';
// const remoteProjectName = 'project-template';
const remoteProjectOwner = 'sau-tools';
const remoteProjectName = 'sau-project-template';

module.exports = {
  getRemoteURL: (options = { branchName: 'master' }) => {
    return `git+https://oss.navercorp.com/${remoteProjectOwner}/${remoteProjectName}.git#${
      options.branchName
    }`;
  },
  localPath: `./node_modules/${remoteProjectName}/template`,
};
