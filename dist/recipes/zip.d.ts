import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface ZipAction {
    action: 'zip';
    config: {
        file_names: string[];
        archive_prefix: string;
        out_dir: string;
        exclude_files: string[];
    };
}
export declare function action_zip(definition: ZipAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
