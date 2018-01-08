import { ContentTypeConstants, HttpRequestHandler, HttpResponseHandler, ObserveType } from './constants';
import { MapperType } from './mapper.type';

/**
 * Use this conf for @GET, @POST, ...
 */
export interface EndpointConfig {
  path?: string;
  mapper?: MapperType<any, any>;
  requestHandlers?: HttpRequestHandler[];
  responseHandlers?: HttpResponseHandler[];
  contentType?: ContentTypeConstants;
  observe?: ObserveType;
}
