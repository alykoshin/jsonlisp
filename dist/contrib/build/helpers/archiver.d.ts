/** @format */
import { ILogger } from '../../../lib/log';
/**
 * @param {String} sourceDir
 * @param {String} out
 * @returns {Promise}
 */
export declare function zipDirectory(sourceDir: string, out_dir: string, outBasename: string, lgr: ILogger): Promise<string>;
