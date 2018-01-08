import { FetchApiBackendAdapter, HttpBackendAdapter } from './http-backend';
import { ContentTypeConstants, HttpRequestHandler, HttpResponseHandler, ObserveType } from './constants';

/**
 * Global configuration for Synapse APIs
 */
export class SynapseConfig {
  static DEFAULT: SynapseConfig = {
    baseUrl: null,
    responseHandlers: [],
    requestHandlers: [],
    observe: ObserveType.BODY,
    headers: {},
    httpBackend: new FetchApiBackendAdapter(),
    contentType: ContentTypeConstants.JSON
  };

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
