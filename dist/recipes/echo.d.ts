import { FullConfig } from "../lib/config";
export interface EchoAction {
    action: 'echo';
    value: string;
}
export declare function action_echo(actionConfig: EchoAction, _fullConfig: FullConfig): Promise<void>;
