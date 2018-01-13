/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { FetchApiBackendAdapter } from './http-backend';
import { ContentTypeConstants, ObserveType } from './constants';
/**
 * Global configuration for Synapse APIs
 */
export class SynapseConfig {
}
SynapseConfig.DEFAULT = {
    baseUrl: undefined,
    responseHandlers: [],
    requestHandlers: [],
    observe: ObserveType.BODY,
    headers: {},
    httpBackend: new FetchApiBackendAdapter(),
    contentType: ContentTypeConstants.JSON
};
function SynapseConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    SynapseConfig.DEFAULT;
    /**
     * The base url.
     * eg:
     *  - 'https://some-service/'
     *  - '127.0.0.1:8080/'
     * @type {?}
     */
    SynapseConfig.prototype.baseUrl;
    /**
     * The http backend adapter implementation;
     * @type {?}
     */
    SynapseConfig.prototype.httpBackend;
    /** @type {?} */
    SynapseConfig.prototype.headers;
    /** @type {?} */
    SynapseConfig.prototype.requestHandlers;
    /** @type {?} */
    SynapseConfig.prototype.responseHandlers;
    /** @type {?} */
    SynapseConfig.prototype.contentType;
    /** @type {?} */
    SynapseConfig.prototype.observe;
}
//# sourceMappingURL=config.type.js.map