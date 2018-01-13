import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'core-js/es7/reflect';
import 'whatwg-fetch';
import 'url-search-params-polyfill';
import '../utils/rxjs-import';
import { SynapseConfig } from './config.type';
export declare class Synapse {
    static readonly OBSERVABLE: ErrorObservable;
    static readonly PROMISE: Promise<never>;
    static init(conf: SynapseConfig): void;
    static getConfig(): SynapseConfig;
    static teardown(): void;
}
export * from './decorators/index';
export * from './http-backend';
export * from './api-config.type';
export * from './config.type';
export * from './endpoint-config.type';
export * from './mapper.type';
export * from './typed-response.model';
