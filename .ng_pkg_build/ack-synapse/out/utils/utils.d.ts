import { QueryParametersType } from '../';
import { HttpBackendAdapter } from '../core/http-backend';
import { SynapseConfig } from '../core/config.type';
import { SynapseApiConfig } from '../core/api-config.type';
import { EndpointConfig } from '../core/endpoint-config.type';
export declare type Constructor<T> = Function & {
    new (...args: any[]): T;
};
export declare function removeTrailingSlash(path: string): string;
export declare function joinPath(...path: string[]): string;
export declare function toQueryString(queryParameters: QueryParametersType | Object): string;
export declare function fromQueryString(queryString: string): Object;
export declare function joinQueryParams(url: string, queryParams: QueryParametersType): string;
export declare function validateHttpBackendAdapter(ba: HttpBackendAdapter): void;
export declare type SynapseMergedConfig = SynapseConfig | SynapseApiConfig | EndpointConfig;
export declare function mergeConfigs<T extends SynapseMergedConfig, U extends SynapseMergedConfig>(conf: T, ...confs: U[]): T & U;
