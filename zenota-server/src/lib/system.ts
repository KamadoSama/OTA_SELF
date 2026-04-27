import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

function exec(cmd: string): void {
  execSync(cmd, { stdio: 'inherit' });
}

export function isRoot(): boolean {
  return process.getuid?.() === 0;
}

export async function installDocker(): Promise<void> {
  const spinner = ora('Installing Docker...').start();
  try {
    exec('curl -fsSL https://get.docker.com | sh');
    exec('systemctl enable docker');
    exec('systemctl start docker');
    spinner.succeed('Docker installed successfully.');
  } catch (error) {
    spinner.fail('Failed to install Docker.');
    throw error;
  }
}

export async function installDockerCompose(): Promise<void> {
  const spinner = ora('Installing Docker Compose plugin...').start();
  try {
    exec('apt-get update -qq && apt-get install -y -qq docker-compose-plugin');
    spinner.succeed('Docker Compose installed successfully.');
  } catch (error) {
    spinner.fail('Failed to install Docker Compose.');
    throw error;
  }
}

export async function ensurePrerequisites(
  dockerInstalled: boolean,
  composeInstalled: boolean
): Promise<void> {
  if (!dockerInstalled) {
    console.log(chalk.yellow('\n⚠  Docker not found. Installing...'));
    await installDocker();
  }
  if (!composeInstalled) {
    console.log(chalk.yellow('\n⚠  Docker Compose not found. Installing...'));
    await installDockerCompose();
  }
}
