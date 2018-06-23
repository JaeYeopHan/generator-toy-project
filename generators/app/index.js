const Generator = require('yeoman-generator');
const exec = require('sync-exec');
const fs = require('fs');
const path = require('path');
const signale = require('signale');

const TemplateDataModel = require('./TemplateDataModel');
const PromptConfig = require('../PromptConfig');
const projectTemplate = require('../projectTemplateInfo');
const DummyPackageJson = require('./DummyPackageJson');

// Option for catching deprecation.
process.traceDeprecation = true;

/**
 * << Generator Description >>
 * * initializing - Your initialization methods (checking current project state, getting configs, etc)
 * * prompting - Where you prompt users for options (where you'd call this.prompt())
 * * configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)
 * * default - If the method name doesn't match a priority, it will be pushed to this group.
 * * writing - Where you write the generator specific files (routes, controllers, etc)
 * * conflicts - Where conflicts are handled (used internally)
 * * install - Where installations are run (npm, bower)
 * * end - Called last, cleanup, say good bye, etc
 **/
class ProjectGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    const templatePath = projectTemplate.localPath;

    this.templateData = new TemplateDataModel();
    this.sourceRoot(templatePath);
    this._isPackagejsonCreated = null;
  }

  prompting() {
    const projectNamePrompt = PromptConfig.projectName;

    projectNamePrompt.default = this._getCurrentFolderName();

    return this.prompt([projectNamePrompt, PromptConfig.projectTypeList])
      .then(({ projectName, projectType }) => {
        this.templateData.setProjectName(projectName);

        if (projectType) {
          return { projectType };
        } else {
          // 직접 입력인 경우
          return this.prompt([PromptConfig.projectTypeGeneral]);
        }
      })
      .then(({ projectType }) => {
        this.templateData.project.type = projectType;
      });
  }

  /**
   * # Step. configuring
   * After prompting, start to scaffolding.
   */
  configuring() {
    console.log('=============================================');

    signale.start(
      `Start to create ${this.templateData.project.name.input} project`,
    );
    console.log('=============================================');
    console.log('');

    this._createInitPackageJson();
  }

  /**
   * # Step writing
   */
  writing() {
    const remoteURL = projectTemplate.getRemoteURL({
      branchName: this.templateData.project.type,
    });

    signale.pending(`1. Fetch project template from remote (${remoteURL})\n`);

    return this._installNpm(remoteURL)
      .then(() => {
        if (this._isPackagejsonCreated) {
          fs.unlinkSync(this.destinationPath('package.json'));
        }
        signale.success(`=> Complete to fetch project template!\n`);
        signale.pending(`2. Copy project template`);

        const tplData = this.templateData;
        tplData.user.name = this.user.git.name();
        tplData.user.email = this.user.git.email();

        this.fs.copyTpl(
          this.templatePath(),
          this.destinationPath(),
          tplData,
          {},
          { globOptions: { dot: true } },
        );

        this._renameFiles();
      })
      .then(() => signale.success(`=> Complete to copy template!\n`));
  }

  /**
   * # Step. install
   * Initialize git.
   * Install npm packages.
   */
  install() {
    // git hook 등을 처리하기 위해
    // package 설정하기 전에 git init 수행
    signale.pending('3. Initializing git');
    const IO_gitInit = exec('git init');

    IO_gitInit.stderr
      ? signale.fail('=> Cannot initialize git in this directory')
      : signale.success('=> Initialize git done!');

    console.log('');

    signale.pending('4. Install NPM Packages');

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false,
    }).then(() => {
      console.log('');
      signale.success('=> Complete to install npm packages\n');
      signale.complete('All Done!! Run by `npm start !`');
      console.log('');
    });
  }

  _getCurrentFolderName() {
    const rootFolderPath = this.destinationRoot();

    return rootFolderPath.match(/[^\/\\]*$/)[0];
  }

  _createInitPackageJson() {
    const packagejsonPath = this.destinationPath('package.json');

    if (fs.existsSync(packagejsonPath)) {
      this._isPackagejsonCreated = false;
    } else {
      const dummyPackageJson = DummyPackageJson.getJSON({
        name: this.templateData.project.name,
      });
      const dummyPackageJsonString = JSON.stringify(dummyPackageJson, null, 2);

      fs.writeFileSync(packagejsonPath, dummyPackageJsonString);

      this._isPackagejsonCreated = true;
    }
  }

  _installNpm(packageName) {
    return new Promise((resolve, reject) => {
      this.spawnCommand('npm', ['install', packageName, '--prefer-offline'])
        .on('error', err => {
          reject(err);
        })
        .on('exit', err => {
          err && reject(err);
          resolve();
        });
    });
  }

  _renameFiles() {
    const gitIgnorePath = path.join(this.destinationPath(), './__.gitignore');

    this.fs.exists(gitIgnorePath) &&
      this.fs.move(
        gitIgnorePath,
        path.join(this.destinationPath(), './.gitignore'),
      );
  }
}

module.exports = ProjectGenerator;
