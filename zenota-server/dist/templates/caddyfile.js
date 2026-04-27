"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caddyfile = void 0;
const caddyfile = (domain) => `
${domain} {
    # API requests
    handle_path /api* {
        reverse_proxy ota_backend:3001
    }

    # Frontend
    handle {
        reverse_proxy ota_frontend:3002
    }

    log {
        output file /var/log/caddy/access.log
    }
}
`;
exports.caddyfile = caddyfile;
