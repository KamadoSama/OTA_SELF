"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopCommand = stopCommand;
exports.startCommand = startCommand;
exports.restartCommand = restartCommand;
const docker_1 = require("../lib/docker");
async function stopCommand() {
    (0, docker_1.runCompose)('stop', '/opt/zenota');
}
async function startCommand() {
    (0, docker_1.runCompose)('start', '/opt/zenota');
}
async function restartCommand() {
    (0, docker_1.runCompose)('restart', '/opt/zenota');
}
