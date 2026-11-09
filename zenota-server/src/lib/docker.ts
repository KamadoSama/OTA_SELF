import * as fs from 'fs';
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
    let dbUrl = '';
    const envPath = `${installDir}/.env`;
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const match = envContent.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        dbUrl = match[1].trim();
      }
    }
    const cmd = dbUrl
      ? `docker exec ota_backend npx prisma db push --accept-data-loss --url "${dbUrl}"`
      : `docker exec ota_backend sh -c 'npx prisma db push --accept-data-loss --url "\$DATABASE_URL"'`;

    execSync(cmd, { stdio: 'inherit' });
    spinner.succeed('Migrations applied successfully.');
  } catch (error) {
    spinner.fail('Failed to run migrations.');
    throw error;
  }
}
