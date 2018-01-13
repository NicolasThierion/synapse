import { HttpBackendAdapter } from './http-backend';
import { ContentTypeConstants, HttpRequestHandler, HttpResponseHandler, ObserveType } from './constants';
/**
 * Global configuration for Synapse APIs
 */
export declare class SynapseConfig {
    static DEFAULT: SynapseConfig;
    /**
     * The base url.
     * eg:
     *  - 'https://some-service/'
     *  - '127.0.0.1:8080/'
     */
    baseUrl: string;
    /**
     * The http backend adapter implementation;
     */
    httpBackend?: HttpBackendAdapter;
    headers?: Object;
    requestHandlers?: HttpRequestHandler[];
    responseHandlers?: HttpResponseHandler[];
    contentType?: ContentTypeConstants;
    observe?: ObserveType;
}
