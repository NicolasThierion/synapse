export enum ContentTypeConstants {
  FORM_DATA = 'form-data',
  X_WWW_URL_ENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  PLAIN_TEXT = 'text/plain',
  JSON = 'application/json',
  JAVASCRIPT = 'application/javascript'
}

export const HeaderConstants = {
  CONTENT_TYPE: 'Content-Type'
};

export enum HttpMethod {
  GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE', PATCH = 'PATCH'
}

export type HttpRequestHandler = (request: Request) => void;
export type HttpResponseHandler = (response: Response) => void;

/**
 * What element of the response should the API return?
 */
export enum ObserveType {
  RESPONSE = 'response',  // the whole response with headers?
  BODY = 'body'           // only the (mapped?) body extracted from the response
}
