import { ContentTypeConstants, HttpRequestHandler, HttpResponseHandler, ObserveType } from './constants';
import { HttpBackendAdapter } from './http-backend';
import { MapperType } from './mapper.type';

export interface SynapseApiConfig {
  path?: string;
  baseUrl?: string;
  httpBackend?: HttpBackendAdapter;
  headers?: Object;
  requestHandlers?: HttpRequestHandler[];
  responseHandlers?: HttpResponseHandler[];
  observe?: ObserveType;
  contentType?: ContentTypeConstants;
  mapper?: MapperType<any, any>;
}
