"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsCommand = logsCommand;
const docker_1 = require("../lib/docker");
async function logsCommand(service) {
    const installDir = '/opt/zenota';
    const action = service ? `logs -f ${service}` : 'logs -f';
    (0, docker_1.runCompose)(action, installDir);
}
