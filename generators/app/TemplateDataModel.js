const ProjectName = require('./ProjectName');

class TemplateDataModel {
  constructor() {
    this.project = {
      name: {
        input: null,
        package: null,
        pascal: null,
        camel: null,
      },
      namespaceList: null,
      type: null,
    };

    this.search = {
      // 프로젝트 type 이 search인 경우
      template: null,
    };

    this.user = {
      name: null,
      email: null,
    };
  }

  setProjectName(projectName) {
    this.project.name.input = projectName;
    this.project.name.package = projectName;
    this.project.name.camel = ProjectName.toCamelCase(projectName);
    this.project.name.pascal = ProjectName.toPascalCase(projectName);
  }
}

module.exports = TemplateDataModel;
