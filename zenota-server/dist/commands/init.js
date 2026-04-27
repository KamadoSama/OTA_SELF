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
exports.initCommand = initCommand;
const prompts_1 = __importDefault(require("prompts"));
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const detect_1 = require("../lib/detect");
const secrets_1 = require("../lib/secrets");
const system_1 = require("../lib/system");
const docker_compose_standalone_1 = require("../templates/docker-compose.standalone");
const docker_compose_dokploy_1 = require("../templates/docker-compose.dokploy");
const caddyfile_1 = require("../templates/caddyfile");
const env_1 = require("../templates/env");
const docker_1 = require("../lib/docker");
async function initCommand() {
    console.log(chalk_1.default.blue.bold('\n🚀 Welcome to ZenOTA Self-Hosted Installer\n'));
    if (!(0, system_1.isRoot)()) {
        console.log(chalk_1.default.red('❌ This command must be run as root (sudo).'));
        process.exit(1);
    }
    const env = (0, detect_1.detect)();
    console.log(chalk_1.default.gray('--- System Detection ---'));
    console.log(`OS: ${env.os} (${env.arch})`);
    console.log(`Distro: ${env.distro}`);
    console.log(`Docker: ${env.dockerInstalled ? chalk_1.default.green('Yes') : chalk_1.default.red('No')}`);
    console.log(`Dokploy: ${env.dokployDetected ? chalk_1.default.yellow('Detected') : 'Not detected'}`);
    console.log(chalk_1.default.gray('------------------------\n'));
    const response = await (0, prompts_1.default)([
        {
            type: 'text',
            name: 'domain',
            message: 'Enter your domain name (e.g., ota.yourdomain.com):',
            validate: value => value.length > 0 ? true : 'Domain is required'
        },
        {
            type: 'text',
            name: 'email',
            message: 'Enter admin email:',
            validate: value => value.includes('@') ? true : 'Invalid email'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter admin password:',
            validate: value => value.length >= 8 ? true : 'Password must be at least 8 characters'
        }
    ]);
    if (!response.domain || !response.email || !response.password) {
        console.log(chalk_1.default.red('\nInstallation cancelled.'));
        return;
    }
    await (0, system_1.ensurePrerequisites)(env.dockerInstalled, env.composeInstalled);
    const installDir = '/opt/zenota';
    if (!fs.existsSync(installDir)) {
        fs.mkdirSync(installDir, { recursive: true });
    }
    const secrets = (0, secrets_1.generateAllSecrets)();
    // Write .env
    fs.writeFileSync(path.join(installDir, '.env'), (0, env_1.envFile)(secrets));
    // Write Docker Compose
    if (env.dokployDetected) {
        console.log(chalk_1.default.yellow('ℹ Dokploy detected. Using Dokploy-compatible configuration.'));
        fs.writeFileSync(path.join(installDir, 'docker-compose.yml'), (0, docker_compose_dokploy_1.dokployCompose)(response.domain));
    }
    else {
        fs.writeFileSync(path.join(installDir, 'docker-compose.yml'), (0, docker_compose_standalone_1.standaloneCompose)(response.domain, 3001, 3000));
        fs.writeFileSync(path.join(installDir, 'Caddyfile'), (0, caddyfile_1.caddyfile)(response.domain));
    }
    console.log(chalk_1.default.blue('\n📦 Pulling images and starting containers...'));
    (0, docker_1.runCompose)('pull', installDir);
    (0, docker_1.runCompose)('up -d', installDir);
    await (0, docker_1.waitForHealthy)('ota_postgres');
    (0, docker_1.runMigrations)(installDir);
    (0, docker_1.seedAdmin)(installDir, response.email, response.password);
    console.log(chalk_1.default.green.bold('\n✨ ZenOTA successfully installed!'));
    console.log(`URL: https://${response.domain}`);
    console.log(`Admin: ${response.email}`);
    console.log(chalk_1.default.gray('\nRun "zenota status" to check service state.'));
}
