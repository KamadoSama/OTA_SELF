export declare function generateSecret(length?: number): string;
export declare function generatePassword(length?: number): string;
export interface GeneratedSecrets {
    dbPassword: string;
    minioPassword: string;
    jwtSecret: string;
    authSecret: string;
}
export declare function generateAllSecrets(): GeneratedSecrets;
