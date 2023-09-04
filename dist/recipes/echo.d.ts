import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface EchoAction {
    action: 'echo';
    value: string;
}
export declare function action_echo(definition: EchoAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
