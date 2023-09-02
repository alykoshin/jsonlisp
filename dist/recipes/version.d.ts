import { ReleaseType } from "semver";
import { FullConfig } from '../lib/config';
export interface VersionAction {
    action: 'version';
    config: {
        release: ReleaseType;
    };
}
export declare function action_version({ config }: VersionAction, fullConfig: FullConfig): Promise<void>;
