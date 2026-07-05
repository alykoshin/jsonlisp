/** @format */
import { State } from '../../../eval/environment';
import { $zipOptions } from '../$zip';
export type SevenZipOptions = Omit<$zipOptions, 'archive_prefix'>;
export declare const sevenZip: (archive_basename: string, options: SevenZipOptions, state: State) => Promise<string>;
