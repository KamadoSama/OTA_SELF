"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCompose = runCompose;
exports.waitForHealthy = waitForHealthy;
exports.runMigrations = runMigrations;
exports.seedAdmin = seedAdmin;
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
function runCompose(action, installDir) {
    try {
        (0, child_process_1.execSync)(`docker compose -f ${installDir}/docker-compose.yml ${action}`, {
            stdio: 'inherit',
        });
    }
    catch (error) {
        throw new Error(`Failed to execute docker compose ${action}`);
    }
}
async function waitForHealthy(service, timeoutSec = 60) {
    const spinner = (0, ora_1.default)(`Waiting for ${service} to be healthy...`).start();
    const start = Date.now();
    while (Date.now() - start < timeoutSec * 1000) {
        try {
            const status = (0, child_process_1.execSync)(`docker inspect --format='{{.State.Health.Status}}' ${service}`, {
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            }).trim();
            if (status === 'healthy') {
                spinner.succeed(`${service} is healthy.`);
                return;
            }
        }
        catch {
            // Container might not be created yet
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    spinner.fail(`${service} failed to become healthy within ${timeoutSec}s.`);
    throw new Error(`${service} health check timed out`);
}
function runMigrations(installDir) {
    const spinner = (0, ora_1.default)('Running database migrations...').start();
    try {
        (0, child_process_1.execSync)(`docker exec ota_backend npx prisma db push`, { stdio: 'inherit' });
        spinner.succeed('Migrations applied successfully.');
    }
    catch (error) {
        spinner.fail('Failed to run migrations.');
        throw error;
    }
}
function seedAdmin(installDir, email, password) {
    const spinner = (0, ora_1.default)('Seeding admin user...').start();
    try {
        // This assumes there's a script or command to create a user in the backend
        // For now, we'll just log that it should be done or implement a small script
        console.log(chalk_1.default.blue(`\n[TODO] Create admin user: ${email} / ${password}`));
        spinner.succeed('Admin user seeding requested.');
    }
    catch (error) {
        spinner.fail('Failed to seed admin user.');
        throw error;
    }
}
