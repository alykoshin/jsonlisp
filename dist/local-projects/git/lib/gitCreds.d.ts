/** @format */
export interface GitCredentials {
    protocol: string;
    username: string;
    password: string;
    hostname: string;
}
export declare const GIT_CONFIG_FNAME = ".git-config";
export declare const GIT_CREDENTIALS_FNAME = ".git-credentials";
export declare function readGitCredentials(): GitCredentials[];
export declare function readSpecificGitCredentials({ hostname, username, }: {
    hostname: string;
    username: string;
}): GitCredentials;
