"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const CONFIG_PATH = 'angular.json';
function readConfig(host) {
    const sourceText = host.read(CONFIG_PATH).toString('utf-8');
    return JSON.parse(sourceText);
}
exports.readConfig = readConfig;
function writeConfig(host, config) {
    host.overwrite(CONFIG_PATH, JSON.stringify(config, null, 2));
}
exports.writeConfig = writeConfig;
function isAngularBrowserProject(projectConfig) {
    if (projectConfig.projectType === 'application') {
        const buildConfig = projectConfig.architect.build;
        return buildConfig.builder === '@angular-devkit/build-angular:browser';
    }
    return false;
}
function getDefaultAngularAppName(config) {
    const projects = config.projects;
    const projectNames = Object.keys(projects);
    for (const projectName of projectNames) {
        const projectConfig = projects[projectName];
        if (isAngularBrowserProject(projectConfig)) {
            return projectName;
        }
    }
    return projectNames[0];
}
exports.getDefaultAngularAppName = getDefaultAngularAppName;
function getAngularAppConfig(config, projectName) {
    if (!config.projects.hasOwnProperty(projectName)) {
        throw new schematics_1.SchematicsException(`Could not find project: ${projectName}`);
    }
    const projectConfig = config.projects[projectName];
    if (isAngularBrowserProject(projectConfig)) {
        return projectConfig;
    }
    if (config.projectType !== 'application') {
        throw new schematics_1.SchematicsException(`Invalid projectType for ${projectName}: ${config.projectType}`);
    }
    else {
        const buildConfig = projectConfig.architect.build;
        throw new schematics_1.SchematicsException(`Invalid builder for ${projectName}: ${buildConfig.builder}`);
    }
}
exports.getAngularAppConfig = getAngularAppConfig;
function addStyle(host, projectName, stylePath) {
    const config = readConfig(host);
    const appConfig = getAngularAppConfig(config, projectName);
    appConfig.architect.build.options.styles.push({
        input: stylePath
    });
    writeConfig(host, config);
}
exports.addStyle = addStyle;
function addAsset(host, projectName, architect, asset) {
    const config = readConfig(host);
    const appConfig = getAngularAppConfig(config, projectName);
    appConfig.architect[architect].options.assets.push(asset);
    writeConfig(host, config);
}
exports.addAsset = addAsset;
function addArchitectBuilder(host, projectName, builderName, builderOpts) {
    const config = readConfig(host);
    const appConfig = getAngularAppConfig(config, projectName);
    appConfig.architect[builderName] = builderOpts;
    writeConfig(host, config);
}
exports.addArchitectBuilder = addArchitectBuilder;
function getWorkspacePath(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    return path;
}
exports.getWorkspacePath = getWorkspacePath;
function getWorkspace(host) {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();
    return core_1.parseJson(content, core_1.JsonParseMode.Loose);
}
exports.getWorkspace = getWorkspace;
