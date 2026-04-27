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
Object.defineProperty(exports, "__esModule", { value: true });
exports.detect = detect;
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
function runQuiet(cmd) {
    try {
        return (0, child_process_1.execSync)(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    }
    catch {
        return '';
    }
}
function detectDistro() {
    try {
        if (fs.existsSync('/etc/os-release')) {
            const release = fs.readFileSync('/etc/os-release', 'utf-8');
            if (release.toLowerCase().includes('ubuntu'))
                return 'ubuntu';
            if (release.toLowerCase().includes('debian'))
                return 'debian';
        }
        return 'unknown';
    }
    catch {
        return 'unknown';
    }
}
function detectDocker() {
    const version = runQuiet('docker --version');
    return { installed: version.length > 0, version };
}
function detectCompose() {
    const v2 = runQuiet('docker compose version');
    if (v2)
        return true;
    const v1 = runQuiet('docker-compose --version');
    return v1.length > 0;
}
function detectDokploy() {
    const containers = runQuiet('docker ps --format "{{.Names}}"');
    return containers.includes('dokploy');
}
function detect() {
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
