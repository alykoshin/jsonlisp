/** @format */
import { Octokit } from 'octokit';
import { RequestError } from '@octokit/request-error';
interface OctoOptions {
}
export declare class Octo {
    octokit?: Octokit;
    options: OctoOptions;
    constructor(options?: OctoOptions);
    _createOctokit(): import("@octokit/core").Octokit & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & {
        graphql: import("@octokit/graphql/dist-types/types").graphql & {
            paginate: (<ResponseType_1 extends object = any>(query: string, initialParameters?: Record<string, any> | undefined) => Promise<ResponseType_1>) & {
                iterator: <ResponseType_2 = any>(query: string, initialParameters?: Record<string, any> | undefined) => {
                    [Symbol.asyncIterator]: () => {
                        next(): Promise<{
                            done: boolean;
                            value: ResponseType_2;
                        }>;
                    };
                };
            };
        };
    } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
        retry: {
            retryRequest: (error: RequestError, retries: number, retryAfter: number) => RequestError;
        };
    };
    _checkGithubHttpError(e: Error): void;
    createGithubRepo({ username, name, description, }: {
        username: string;
        name: string;
        description: string;
    }): Promise<boolean>;
}
export {};
