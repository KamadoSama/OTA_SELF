"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoot = isRoot;
exports.installDocker = installDocker;
exports.installDockerCompose = installDockerCompose;
exports.ensurePrerequisites = ensurePrerequisites;
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
function exec(cmd) {
    (0, child_process_1.execSync)(cmd, { stdio: 'inherit' });
}
function isRoot() {
    return process.getuid?.() === 0;
}
async function installDocker() {
    const spinner = (0, ora_1.default)('Installing Docker...').start();
    try {
        exec('curl -fsSL https://get.docker.com | sh');
        exec('systemctl enable docker');
        exec('systemctl start docker');
        spinner.succeed('Docker installed successfully.');
    }
    catch (error) {
        spinner.fail('Failed to install Docker.');
        throw error;
    }
}
async function installDockerCompose() {
    const spinner = (0, ora_1.default)('Installing Docker Compose plugin...').start();
    try {
        exec('apt-get update -qq && apt-get install -y -qq docker-compose-plugin');
        spinner.succeed('Docker Compose installed successfully.');
    }
    catch (error) {
        spinner.fail('Failed to install Docker Compose.');
        throw error;
    }
}
async function ensurePrerequisites(dockerInstalled, composeInstalled) {
    if (!dockerInstalled) {
        console.log(chalk_1.default.yellow('\n⚠  Docker not found. Installing...'));
        await installDocker();
    }
    if (!composeInstalled) {
        console.log(chalk_1.default.yellow('\n⚠  Docker Compose not found. Installing...'));
        await installDockerCompose();
    }
}
