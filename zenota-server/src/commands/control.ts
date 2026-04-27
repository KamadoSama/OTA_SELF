import { runCompose } from '../lib/docker';

export async function stopCommand() {
  runCompose('stop', '/opt/zenota');
}

export async function startCommand() {
  runCompose('start', '/opt/zenota');
}

export async function restartCommand() {
  runCompose('restart', '/opt/zenota');
}
