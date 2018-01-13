import { ContentTypeConstants, HttpRequestHandler, HttpResponseHandler, ObserveType } from './constants';
import { HttpBackendAdapter } from './http-backend';

export interface SynapseApiConfig {
  path?: string;
  baseUrl?: string;
  httpBackend?: HttpBackendAdapter;
  headers?: Object;
  requestHandlers?: HttpRequestHandler[];
  responseHandlers?: HttpResponseHandler[];
  observe?: ObserveType;
  contentType?: ContentTypeConstants;
}
