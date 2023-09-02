import { FullConfig } from "../lib/config";
export interface ZipAction {
    action: 'zip';
    config: {
        file_names: string[];
        archive_prefix: string;
        out_dir: string;
        exclude_files: string[];
    };
}
export declare function action_zip({ config }: ZipAction, fullConfig: FullConfig): Promise<void>;
