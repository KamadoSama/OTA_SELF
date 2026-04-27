export interface Environment {
    os: string;
    arch: string;
    distro: string;
    dockerInstalled: boolean;
    dockerVersion: string;
    composeInstalled: boolean;
    dokployDetected: boolean;
}
export declare function detect(): Environment;
