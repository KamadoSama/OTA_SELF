import { execSync } from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

export interface Environment {
  os: string;          // "linux", "darwin"
  arch: string;        // "x64", "arm64"
  distro: string;      // "ubuntu", "debian", "unknown"
  dockerInstalled: boolean;
  dockerVersion: string;
  composeInstalled: boolean;
  dokployDetected: boolean;
}

function runQuiet(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function detectDistro(): string {
  try {
    if (fs.existsSync('/etc/os-release')) {
      const release = fs.readFileSync('/etc/os-release', 'utf-8');
      if (release.toLowerCase().includes('ubuntu')) return 'ubuntu';
      if (release.toLowerCase().includes('debian')) return 'debian';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

function detectDocker(): { installed: boolean; version: string } {
  const version = runQuiet('docker --version');
  return { installed: version.length > 0, version };
}

function detectCompose(): boolean {
  const v2 = runQuiet('docker compose version');
  if (v2) return true;
  const v1 = runQuiet('docker-compose --version');
  return v1.length > 0;
}

function detectDokploy(): boolean {
  const containers = runQuiet('docker ps --format "{{.Names}}"');
  return containers.includes('dokploy');
}

export function detect(): Environment {
  return {
    os: os.platform(),
    arch: os.arch(),
    distro: detectDistro(),
    ...(() => {
      const { installed, version } = detectDocker();
      return { dockerInstalled: installed, dockerVersion: version };
    })(),
    composeInstalled: detectCompose(),
    dokployDetected: detectDokploy(),
  };
}
