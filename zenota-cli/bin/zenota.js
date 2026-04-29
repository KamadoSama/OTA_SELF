#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const child_process_1 = require("child_process");
const adm_zip_1 = __importDefault(require("adm-zip"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const ora_1 = __importDefault(require("ora"));
const os = __importStar(require("os"));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
const program = new commander_1.Command();
program.name('zenota').description('ZenOTA CLI for Expo updates').version(packageJson.version);
const CONFIG_PATH = path.join(os.homedir(), '.zenota-config.json');
const getApiUrl = () => {
    if (process.env.ZENOTA_API_URL)
        return process.env.ZENOTA_API_URL;
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            if (config.apiUrl)
                return config.apiUrl;
        }
        catch (e) { }
    }
    return 'https://api-zenota.diesestudio.com/api';
};
program
    .command('login')
    .description('Login to ZenOTA using your API Key')
    .action(async () => {
    console.log(chalk_1.default.blue('Welcome to ZenOTA!'));
    const response = await (0, prompts_1.default)([
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
        console.log(chalk_1.default.red('Login cancelled.'));
        return;
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({
        apiKey: response.apiKey,
        apiUrl: response.apiUrl.replace(/\/$/, '') // Remove trailing slash
    }));
    console.log(chalk_1.default.green('Successfully logged in!'));
});
program
    .command('publish')
    .description('Export and publish your Expo app to ZenOTA')
    .option('-c, --channel <channel>', 'Update channel to publish to', 'production')
    .option('-p, --platform <platform>', 'Platform to export (android, ios, all)')
    .action(async (options) => {
    if (!fs.existsSync(CONFIG_PATH)) {
        console.log(chalk_1.default.red('Not logged in. Please run `zenota login` first.'));
        process.exit(1);
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    const apiKey = config.apiKey;
    const appJsonPath = path.join(process.cwd(), 'app.json');
    if (!fs.existsSync(appJsonPath)) {
        console.log(chalk_1.default.red('Error: app.json not found in current directory.'));
        process.exit(1);
    }
    const appJsonContent = fs.readFileSync(appJsonPath, 'utf-8');
    // Basic comment stripping (handles // comments but ignores them in URLs like https://)
    const cleanAppJson = appJsonContent.replace(/(^|[^:])\/\/.*$/gm, '$1');
    let appJson;
    try {
        appJson = JSON.parse(cleanAppJson);
    }
    catch (e) {
        console.log(chalk_1.default.red(`Error: app.json is not valid JSON. ${e.message}`));
        process.exit(1);
    }
    const appName = appJson?.expo?.slug || appJson?.expo?.name;
    const runtimeVersion = appJson?.expo?.runtimeVersion;
    const channelName = options.channel;
    if (!appName) {
        console.log(chalk_1.default.red('Error: Could not determine app name from app.json'));
        process.exit(1);
    }
    // Ask for platform if not provided via options
    let platform = options.platform;
    if (!platform) {
        const response = await (0, prompts_1.default)({
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
        console.log(chalk_1.default.red('Publication cancelled.'));
        return;
    }
    const platformArg = platform === 'all' ? '--platform android --platform ios' : `--platform ${platform}`;
    const displayPlatform = platform === 'all' ? 'Android & iOS' : platform.toUpperCase();
    console.log(chalk_1.default.blue(`Publishing "${appName}" to channel "${channelName}" [${displayPlatform}]...`));
    const exportSpinner = (0, ora_1.default)(`Running "npx expo export ${platformArg}"...`).start();
    try {
        // Use CI=1 for non-interactive mode and remove --runtime-version which is handled via backend override
        (0, child_process_1.execSync)(`npx expo export ${platformArg}`, {
            stdio: 'pipe',
            env: { ...process.env, CI: '1' }
        });
        exportSpinner.succeed('Expo export finished successfully.');
    }
    catch (e) {
        exportSpinner.fail('Expo export failed.');
        if (e.stderr) {
            console.error(chalk_1.default.red(e.stderr.toString()));
        }
        if (e.stdout) {
            console.log(e.stdout.toString());
        }
        process.exit(1);
    }
    const zipSpinner = (0, ora_1.default)('Zipping dist folder...').start();
    const zip = new adm_zip_1.default();
    zip.addLocalFolder(path.join(process.cwd(), 'dist'));
    const zipBuffer = zip.toBuffer();
    zipSpinner.succeed('Zipped successfully.');
    const uploadSpinner = (0, ora_1.default)('Uploading to ZenOTA...').start();
    try {
        const form = new form_data_1.default();
        form.append('app', appName);
        form.append('channel', channelName);
        if (runtimeVersion) {
            form.append('runtimeVersion', runtimeVersion);
        }
        form.append('file', zipBuffer, {
            filename: 'update.zip',
            contentType: 'application/zip',
        });
        const response = await axios_1.default.post(`${getApiUrl()}/cli/publish`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${apiKey}`
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 0 // Wait indefinitely
        });
        uploadSpinner.succeed(chalk_1.default.green(`Update published! ID: ${response.data.updateId}`));
    }
    catch (error) {
        uploadSpinner.fail('Upload failed.');
        if (error.response?.data?.message) {
            console.error(chalk_1.default.red(`Server Error: ${error.response.data.message}`));
        }
        else {
            console.error(chalk_1.default.red(error.message));
        }
    }
});
program.parse();
