#!/usr/bin/env node
import { Command } from 'commander';

import { initCommand } from './commands/init';
import { statusCommand } from './commands/status';
import { logsCommand } from './commands/logs';
import { stopCommand, startCommand, restartCommand } from './commands/control';

const program = new Command();
program
  .name('zenota')
  .description('ZenOTA Self-Hosted Server CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize ZenOTA server deployment')
  .action(initCommand);

program
  .command('status')
  .description('Check ZenOTA service status')
  .action(statusCommand);

program
  .command('logs [service]')
  .description('View ZenOTA service logs')
  .action(logsCommand);

program
  .command('stop')
  .description('Stop ZenOTA services')
  .action(stopCommand);

program
  .command('start')
  .description('Start ZenOTA services')
  .action(startCommand);

program
  .command('restart')
  .description('Restart ZenOTA services')
  .action(restartCommand);

program.parse();
