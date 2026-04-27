export declare function runCompose(action: string, installDir: string): void;
export declare function waitForHealthy(service: string, timeoutSec?: number): Promise<void>;
export declare function runMigrations(installDir: string): void;
export declare function seedAdmin(installDir: string, email: string, password: string): void;
