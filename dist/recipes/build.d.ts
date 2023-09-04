import { FullConfig } from "../lib/config";
export interface BuildAction {
    action: 'build';
    config: {
        base_dir: string;
        env: {
            [key: string]: string;
        };
    };
}
export declare function action_build(actionDefinition: BuildAction, fullConfig: FullConfig): Promise<void>;
