export declare function isRoot(): boolean;
export declare function installDocker(): Promise<void>;
export declare function installDockerCompose(): Promise<void>;
export declare function ensurePrerequisites(dockerInstalled: boolean, composeInstalled: boolean): Promise<void>;
