#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';
import { execSync } from 'child_process';
import AdmZip from 'adm-zip';
import axios from 'axios';
import FormData from 'form-data';
import ora from 'ora';
import * as os from 'os';

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();
program.name('zenota').description('ZenOTA CLI for Expo updates').version(packageJson.version);

const CONFIG_PATH = path.join(os.homedir(), '.zenota-config.json');

const getApiUrl = () => {
  if (process.env.ZENOTA_API_URL) return process.env.ZENOTA_API_URL;
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      if (config.apiUrl) return config.apiUrl;
    } catch (e) {}
  }
  return 'https://api-zenota.diesestudio.com/api';
};

program
  .command('login')
  .description('Login to ZenOTA using your API Key')
  .action(async () => {
    console.log(chalk.blue('Welcome to ZenOTA!'));
    
    const response = await prompts([
      {
        type: 'text',
        name: 'apiUrl',
        message: 'Enter ZenOTA API URL:',
        initial: getApiUrl()
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your ZenOTA API Key:',
      }
    ]);

    if (!response.apiKey || !response.apiUrl) {
      console.log(chalk.red('Login cancelled.'));
      return;
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ 
      apiKey: response.apiKey,
      apiUrl: response.apiUrl.replace(/\/$/, '') // Remove trailing slash
    }));
    console.log(chalk.green('Successfully logged in!'));
  });

program
  .command('publish')
  .description('Export and publish your Expo app to ZenOTA')
  .option('-c, --channel <channel>', 'Update channel to publish to', 'production')
  .option('-p, --platform <platform>', 'Platform to export (android, ios, all)')
  .action(async (options) => {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.log(chalk.red('Not logged in. Please run `zenota login` first.'));
      process.exit(1);
    }
    
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    const apiKey = config.apiKey;

    const appJsonPath = path.join(process.cwd(), 'app.json');
    if (!fs.existsSync(appJsonPath)) {
      console.log(chalk.red('Error: app.json not found in current directory.'));
      process.exit(1);
    }

    const appJsonContent = fs.readFileSync(appJsonPath, 'utf-8');
    // Basic comment stripping (handles // comments but ignores them in URLs like https://)
    const cleanAppJson = appJsonContent.replace(/(^|[^:])\/\/.*$/gm, '$1');
    
    let appJson;
    try {
      appJson = JSON.parse(cleanAppJson);
    } catch (e: any) {
      console.log(chalk.red(`Error: app.json is not valid JSON. ${e.message}`));
      process.exit(1);
    }

    const appName = appJson?.expo?.slug || appJson?.expo?.name;
    const runtimeVersion = appJson?.expo?.runtimeVersion;
    const channelName = options.channel;

    if (!appName) {
      console.log(chalk.red('Error: Could not determine app name from app.json'));
      process.exit(1);
    }

    // Ask for platform if not provided via options
    let platform = options.platform;
    if (!platform) {
      const response = await prompts({
        type: 'select',
        name: 'platform',
        message: 'Select platform to publish:',
        choices: [
          { title: 'Android', value: 'android' },
          { title: 'iOS', value: 'ios' },
          { title: 'All (Android & iOS)', value: 'all' },
        ],
        initial: 2
      });
      platform = response.platform;
    }

    if (!platform) {
      console.log(chalk.red('Publication cancelled.'));
      return;
    }

    const platformArg = platform === 'all' ? '--platform android --platform ios' : `--platform ${platform}`;
    const displayPlatform = platform === 'all' ? 'Android & iOS' : platform.toUpperCase();

    console.log(chalk.blue(`Publishing "${appName}" to channel "${channelName}" [${displayPlatform}]...`));

    const exportSpinner = ora(`Running "npx expo export ${platformArg}"...`).start();
    try {
      // Use CI=1 for non-interactive mode and remove --runtime-version which is handled via backend override
      execSync(`npx expo export ${platformArg}`, { 
        stdio: 'pipe', 
        env: { ...process.env, CI: '1' } 
      });
      exportSpinner.succeed('Expo export finished successfully.');
    } catch (e: any) {
      exportSpinner.fail('Expo export failed.');
      if (e.stderr) {
        console.error(chalk.red(e.stderr.toString()));
      }
      if (e.stdout) {
        console.log(e.stdout.toString());
      }
      process.exit(1);
    }

    const zipSpinner = ora('Zipping dist folder...').start();
    const zip = new AdmZip();
    zip.addLocalFolder(path.join(process.cwd(), 'dist'));
    const zipBuffer = zip.toBuffer();
    zipSpinner.succeed('Zipped successfully.');

    const uploadSpinner = ora('Uploading to ZenOTA...').start();
    try {
      const form = new FormData();
      form.append('app', appName);
      form.append('channel', channelName);
      if (runtimeVersion) {
        form.append('runtimeVersion', runtimeVersion);
      }
      form.append('file', zipBuffer, {
        filename: 'update.zip',
        contentType: 'application/zip',
      });

      const response = await axios.post(`${getApiUrl()}/cli/publish`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 0 // Wait indefinitely
      });

      uploadSpinner.succeed(chalk.green(`Update published! ID: ${response.data.updateId}`));
    } catch (error: any) {
      uploadSpinner.fail('Upload failed.');
      if (error.response?.data?.message) {
         console.error(chalk.red(`Server Error: ${error.response.data.message}`));
      } else {
         console.error(chalk.red(error.message));
      }
    }
  });

program.parse();
