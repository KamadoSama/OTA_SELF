import prompts from 'prompts';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { detect } from '../lib/detect';
import { generateAllSecrets } from '../lib/secrets';
import { isRoot, ensurePrerequisites } from '../lib/system';
import { standaloneCompose } from '../templates/docker-compose.standalone';
import { dokployCompose } from '../templates/docker-compose.dokploy';
import { caddyfile } from '../templates/caddyfile';
import { envFile } from '../templates/env';
import { runCompose, waitForHealthy, runMigrations } from '../lib/docker';

export async function initCommand() {
  console.log(chalk.blue.bold('\n🚀 Welcome to ZenOTA Self-Hosted Installer\n'));

  if (!isRoot()) {
    console.log(chalk.red('❌ This command must be run as root (sudo).'));
    process.exit(1);
  }

  const env = detect();
  console.log(chalk.gray('--- System Detection ---'));
  console.log(`OS: ${env.os} (${env.arch})`);
  console.log(`Distro: ${env.distro}`);
  console.log(`Docker: ${env.dockerInstalled ? chalk.green('Yes') : chalk.red('No')}`);
  console.log(`Dokploy: ${env.dokployDetected ? chalk.yellow('Detected') : 'Not detected'}`);
  console.log(chalk.gray('------------------------\n'));

  const response = await prompts([
    {
      type: 'text',
      name: 'domain',
      message: 'Enter your domain name (e.g., ota.yourdomain.com):',
      validate: value => value.length > 0 ? true : 'Domain is required'
    },
  ]);

  if (!response.domain) {
    console.log(chalk.red('\nInstallation cancelled.'));
    return;
  }

  await ensurePrerequisites(env.dockerInstalled, env.composeInstalled);

  const installDir = '/opt/zenota';
  if (!fs.existsSync(installDir)) {
    fs.mkdirSync(installDir, { recursive: true });
  }

  const secrets = generateAllSecrets();
  
  // Write .env
  fs.writeFileSync(path.join(installDir, '.env'), envFile(secrets));

  // Write Docker Compose
  if (env.dokployDetected) {
    console.log(chalk.yellow('ℹ Dokploy detected. Using Dokploy-compatible configuration.'));
    fs.writeFileSync(path.join(installDir, 'docker-compose.yml'), dokployCompose(response.domain));

    const dokployDynamicDir = '/etc/dokploy/traefik/dynamic';
    if (fs.existsSync(dokployDynamicDir)) {
      const traefikDynamicConfig = `http:
  routers:
    zenota:
      rule: "Host(\`${response.domain}\`)"
      entryPoints:
        - websecure
      service: zenota-service
      tls:
        certResolver: letsencrypt
    zenota-http:
      rule: "Host(\`${response.domain}\`)"
      entryPoints:
        - web
      service: zenota-service

  services:
    zenota-service:
      loadBalancer:
        servers:
          - url: "http://ota_frontend:3002"
`;
      fs.writeFileSync(path.join(dokployDynamicDir, 'zenota.yml'), traefikDynamicConfig);
      console.log(chalk.green('✔ Registered Traefik configuration in Dokploy.'));
    }
  } else {
    fs.writeFileSync(path.join(installDir, 'docker-compose.yml'), standaloneCompose(response.domain, 3001, 3000));
    fs.writeFileSync(path.join(installDir, 'Caddyfile'), caddyfile(response.domain));
  }

  console.log(chalk.blue('\n📦 Pulling images and starting containers...'));
  runCompose('pull', installDir);
  runCompose('up -d', installDir);

  await waitForHealthy('ota_postgres');
  
  runMigrations(installDir);
  runCompose('restart backend', installDir);

  console.log(chalk.green.bold('\n✨ ZenOTA successfully installed!'));
  console.log(`URL: https://${response.domain}`);
  console.log(chalk.yellow('\nℹ ACTION REQUIRED: Open the URL above to create your administrator account.'));
  console.log(chalk.gray('\nRun "zenota status" to check service state.'));
}
