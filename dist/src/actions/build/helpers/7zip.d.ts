/** @format */
import { State } from '../../../apps/runner/lib/state';
import { $zipOptions } from '../$zip';
export type SevenZipOptions = Omit<$zipOptions, 'archive_prefix'>;
export declare const sevenZip: (archive_basename: string, options: SevenZipOptions, state: State) => Promise<string>;
