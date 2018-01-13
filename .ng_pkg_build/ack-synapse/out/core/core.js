/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import 'core-js/es7/reflect';
import 'whatwg-fetch';
import 'url-search-params-polyfill';
import { Observable } from 'rxjs/Observable';
import '../utils/rxjs-import';
import { SynapseConfig } from './config.type';
import { assert } from '../utils/assert';
import { mergeConfigs, validateHttpBackendAdapter } from '../utils/utils';
class StateError extends Error {
    /**
     * @param {?} s
     */
    constructor(s) {
        super(s);
    }
}
export class Synapse {
    /**
     * @param {?} conf
     * @return {?}
     */
    static init(conf) {
        if (global.__SynapseConfig) {
            assert(false);
            throw new StateError('Synapse already initialized');
        }
        conf = mergeConfigs(conf, SynapseConfig.DEFAULT);
        validateHttpBackendAdapter(conf.httpBackend);
        global.__SynapseConfig = conf;
    }
    /**
     * @return {?}
     */
    static getConfig() {
        if (!global.__SynapseConfig) {
            throw new StateError('Synapse not initialized');
        }
        return global.__SynapseConfig;
    }
    /**
     * @return {?}
     */
    static teardown() {
        global.__SynapseConfig = undefined;
    }
}
Synapse.OBSERVABLE = Observable.throw('should only use SynapseConfig.OBSERVABLE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');
Synapse.PROMISE = Promise.reject('should only use SynapseConfig.PROMISE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');
function Synapse_tsickle_Closure_declarations() {
    /** @type {?} */
    Synapse.OBSERVABLE;
    /** @type {?} */
    Synapse.PROMISE;
}
export { SynapseApi, GET, POST, PUT, PATCH, DELETE, _assertIsResponsePromise, PathParam, QueryParams, Headers, Body } from './decorators/index';
export { FetchApiBackendAdapter } from './http-backend';
export { SynapseConfig } from './config.type';
export { TypedResponse } from './typed-response.model';
//# sourceMappingURL=core.js.map