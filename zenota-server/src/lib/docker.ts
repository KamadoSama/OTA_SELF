import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

export function runCompose(action: string, installDir: string): void {
  try {
    execSync(`docker compose -f ${installDir}/docker-compose.yml ${action}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    throw new Error(`Failed to execute docker compose ${action}`);
  }
}

export async function waitForHealthy(service: string, timeoutSec: number = 60): Promise<void> {
  const spinner = ora(`Waiting for ${service} to be healthy...`).start();
  const start = Date.now();
  
  while (Date.now() - start < timeoutSec * 1000) {
    try {
      const status = execSync(`docker inspect --format='{{.State.Health.Status}}' ${service}`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
      
      if (status === 'healthy') {
        spinner.succeed(`${service} is healthy.`);
        return;
      }
    } catch {
      // Container might not be created yet
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  spinner.fail(`${service} failed to become healthy within ${timeoutSec}s.`);
  throw new Error(`${service} health check timed out`);
}

export function runMigrations(installDir: string): void {
  const spinner = ora('Running database migrations...').start();
  try {
    execSync(`docker exec ota_backend npx prisma db push`, { stdio: 'inherit' });
    spinner.succeed('Migrations applied successfully.');
  } catch (error) {
    spinner.fail('Failed to run migrations.');
    throw error;
  }
}

export function seedAdmin(installDir: string, email: string, password: string): void {
  const spinner = ora('Seeding admin user...').start();
  try {
    // This assumes there's a script or command to create a user in the backend
    // For now, we'll just log that it should be done or implement a small script
    console.log(chalk.blue(`\n[TODO] Create admin user: ${email} / ${password}`));
    spinner.succeed('Admin user seeding requested.');
  } catch (error) {
    spinner.fail('Failed to seed admin user.');
    throw error;
  }
}
