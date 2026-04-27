#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = require("./commands/init");
const status_1 = require("./commands/status");
const logs_1 = require("./commands/logs");
const control_1 = require("./commands/control");
const program = new commander_1.Command();
program
    .name('zenota')
    .description('ZenOTA Self-Hosted Server CLI')
    .version('1.0.0');
program
    .command('init')
    .description('Initialize ZenOTA server deployment')
    .action(init_1.initCommand);
program
    .command('status')
    .description('Check ZenOTA service status')
    .action(status_1.statusCommand);
program
    .command('logs [service]')
    .description('View ZenOTA service logs')
    .action(logs_1.logsCommand);
program
    .command('stop')
    .description('Stop ZenOTA services')
    .action(control_1.stopCommand);
program
    .command('start')
    .description('Start ZenOTA services')
    .action(control_1.startCommand);
program
    .command('restart')
    .description('Restart ZenOTA services')
    .action(control_1.restartCommand);
program.parse();
