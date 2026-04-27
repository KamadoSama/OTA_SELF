"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = statusCommand;
const docker_1 = require("../lib/docker");
async function statusCommand() {
    const installDir = '/opt/zenota';
    console.log('\n--- ZenOTA Service Status ---');
    (0, docker_1.runCompose)('ps', installDir);
}
