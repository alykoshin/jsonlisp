import { ReleaseType } from "semver";
import { FullConfig } from '../lib/config';
import { Runner } from "../lib/runner";
export interface VersionAction {
    action: 'version';
    config: {
        release: ReleaseType;
    };
}
export declare function action_version(definition: VersionAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
