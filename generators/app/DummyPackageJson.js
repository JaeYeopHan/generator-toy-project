module.exports = {
  getJSON: function(customPackageJson = {}) {
    const defaultPackageJson = {
      name: 'copy-from-remote',
      description: 'dummy-package-json',
      version: '0.1.0',
      bugs: {
        url: '',
      },
      homepage: '',
      repository: {
        type: 'git',
        url: '',
      },
      license: 'MIT',
    };

    return Object.assign(defaultPackageJson, customPackageJson);
  },
};
