import { FullConfig } from "../lib/config";
export interface BuildAction {
    action: 'build';
    config: {
        target: string;
    };
}
export declare function action_build({ config }: BuildAction, fullConfig: FullConfig): Promise<void>;
