import { SynapseApiConfig } from './synapse-api.decorator';
import { Observable } from 'rxjs/Observable';
import { assert } from '../../utils/assert';
import { SynapseApiReflect } from './synapse-api.reflect';
import { joinPath, joinQueryParams, toQueryString } from '../../utils/utils';
import DecoratedArgs = SynapseApiReflect.DecoratedArgs;
import { MapperType } from '../mapper.type';
import { HttpRequestHandler, HttpMethod, HttpResponseHandler, ContentType } from '../core';
import { HttpBackendAdapter } from '../http-backend.interface';
import { SynapseError } from '../../utils/synapse-error';
import * as _ from 'lodash';

export interface EndpointParameters {
  // TODO support for mappers
  // TODO support for handler
  path?: string;
  mapper?: MapperType<any, any>;
  requestHandlers?: HttpRequestHandler[];
  responseHandlers?: HttpResponseHandler[];
}

interface RequestParameters {
  request: Request;
  requestHandlers: HttpRequestHandler[];
  responseHandlers: HttpResponseHandler[];
}

type EndpointReturnType = Promise<Response> | Observable<Response>;

class CallArgs {
  pathParams?: string[];
  queryParams?: QueryParametersType;
  headers?: HeadersType;
  body?: any;
}

export interface QueryParametersType {
  [k: string]: string | string[];
}

export interface HeadersType {
  [k: string]: string | string[];
}

export type PathParamsType = string | number | boolean;


export function GET(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.GET, params);
}

export function POST(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.POST, params);
}

export function PUT(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PUT, params);
}

export function PATCH(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PATCH, params);
}

export function DELETE(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.DELETE, params);
}

function _httpRequestDecorator(method: HttpMethod, params: EndpointParameters | string): MethodDecorator {
  return function HttpMethodDecorator(target: Object,
                                      propertyKey: string | symbol,
                                      descriptor: TypedPropertyDescriptor<any>): void {
    const original = descriptor.value;
    const params_ = _asEndpointParameters(params);

    const qId = params_.path.indexOf('?');
    let parsedQueryParams = {};
    if (qId >= 0) {
      const queryString = params_.path.substring(qId + 1);
      params_.path = params_.path.substring(0, qId);

      parsedQueryParams = JSON.parse(`{"${decodeURI(queryString)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')}"}`);
    }

    if (!_.isFunction(original)) {
      throw new TypeError(`@${method} should annotate methods only`);
    }

    // infer desired return type, and make a converter for it (Promise / Observable)
    const returnTypeConverter = _returnTypeConverter(descriptor, propertyKey);
    descriptor.value = function (...args: any[]): EndpointReturnType {

      // do not only rely on target.
      // Target is proto of the annotated class of this method. If we call this method from a child class,
      // we rather want to get proto of this child class.
      let conf = SynapseApiReflect.getConf(this.__proto__);
      if (SynapseApiReflect.hasConf(target) && target !== this.__proto__) {
        // but also get config from parent class if any
        conf = _.defaultsDeep(conf, SynapseApiReflect.getConf(target));
      }

      const decoratedArgs = SynapseApiReflect.getDecoratedArgs(target, propertyKey);
      const cargs: CallArgs = _parseArgs(args, decoratedArgs);
      cargs.queryParams = _mergeQueryParams([parsedQueryParams, cargs.queryParams]);
      params_.requestHandlers = [].concat(params_.requestHandlers || []).concat(conf.requestHandlers || []);
      const req: Request = _createRequest(method, cargs, params_, conf);

      // execute the request
      const res = _doRequest(conf.httpBackend, _makeRequestParameters(req, conf, params_));

      // return result as a promise / observable.
      return returnTypeConverter(res);
    };
  };
}

function _doRequest(http: HttpBackendAdapter, requestParams: RequestParameters): Promise<Response> {
  _applyRequestHandlers(requestParams);
  const r = requestParams.request;

  switch (r.method) {
    case HttpMethod.GET:
      return http.get(r);
    case HttpMethod.POST:
      return http.post(r);
    case HttpMethod.PUT:
      return http.put(r);
    case HttpMethod.DELETE:
      return http.delete(r);
    case HttpMethod.PATCH:
      return http.patch(r);
    default:
      throw new TypeError(`unexpected method : ${r.method}`);
  }
}

function _makeUrl(baseUrl: string, path: string, pathParams: PathParamsType[], queryParams: QueryParametersType): string {
  // TODO sanitize.
  // TODO check path parameters
  // TODO populate path parameters
  assert(!_.isUndefined(queryParams));
  assert(!_.isUndefined(pathParams));
  assert(!_.isUndefined(baseUrl));
  assert(!_.isUndefined(path));
  return joinQueryParams(joinPath(baseUrl, _replacePathParams(path, pathParams)), queryParams);
}

function _mergeQueryParams(queryParams: Object[]) {
  return _.mergeWith({}, ...queryParams.filter(a => !_.isUndefined(a)),
    (objValue: any, srcValue: any, key: string, object: any, source: any, stack: any) => {
      if (_.isUndefined(objValue)) {
        object[key] = srcValue;
      } else {
        if (!_.isUndefined(srcValue)) {
          const o = [].concat(objValue);
          o.push(srcValue);
          object[key] = o;
        }
      }

      return object[key];
    });
}

function _parseArgs(args: any[], decoratedArgs: DecoratedArgs): CallArgs {
  const res = new CallArgs();
  res.queryParams = _mergeQueryParams(
    decoratedArgs.query
      .map(i => args[i]));

  res.headers = decoratedArgs.headers
    .map(i => args[i])
    .reduce((previousValue, currentValue) => _.defaultsDeep(previousValue, currentValue), {});
  res.pathParams = decoratedArgs.path.map(i => args[i]);

  if (decoratedArgs.body) {
    const contentType = decoratedArgs.body.params.contentType;
    res.body = _wrapBody(args[decoratedArgs.body.index], contentType, res);
  } else {
    res.body = null;
  }

  return res;
}

function _wrapBody(body: any, contentType: ContentType, callArgs: CallArgs): any {
  // TODO support other formats
  const getContentType = () => callArgs.headers['Content-Type'];
  const setContentType = (ct) => callArgs.headers['Content-Type'] = ct;

  if (getContentType() && contentType !== getContentType()) {
    throw new SynapseError(`Tried to send a @Body with Content-Type="${contentType}", but "Content-Type" header has already been set to "${getContentType()}"`);
  }

  switch (contentType) {
    case ContentType.JSON:
      setContentType(contentType);

      return JSON.stringify(body);
    case ContentType.X_WWW_URL_ENCODED:
      return new URLSearchParams(toQueryString(body));
    default:
      throw new Error(`unsupported ContentType: ${contentType}`);
  }
}

function _replacePathParams(path: string, pathParams: (string | number | boolean)[] = []): string {
  let i = 0;
  const PATH_PARAMS_REGEX = /:[A-Za-z\d]+/;
  pathParams.forEach(p => {
    // if no more pathParams to replace
    if (!path.match(PATH_PARAMS_REGEX)) {
      throw new Error(`Too many @PathParam provided for url "${path}".
      (got ${pathParams.length}, but expected ${i}). Cannot bind value ${p} to any path parameter`);
    }

    path = path.replace(PATH_PARAMS_REGEX, `${p}`);
    if (_.isUndefined(p)) {
      throw new TypeError(`${path} : value for path parameter #${i} is undefined`);
    }
    i++;
  });

  // if still some pathParams to replace
  const result = path.match(PATH_PARAMS_REGEX);

  if (result) {
    throw new Error(`path param "${result[0]}" not provided for url "${path}"`);
  }

  return path;
}

function _asEndpointParameters(params: EndpointParameters | string = ''): EndpointParameters {
  let params_: EndpointParameters;
  if (_.isString(params)) {
    params_ = {
      path: params as string
    };
  } else {
    params_ = _.cloneDeep(params) as EndpointParameters;
  }

  params_.path = params_.path || '';
  params_.requestHandlers = params_.requestHandlers || [];

  return params_;
}

function _createRequest(method: HttpMethod,
                        args: CallArgs,
                        params: EndpointParameters,
                        conf: SynapseApiConfig): Request {
  if (method === HttpMethod.GET && args.body) {
    throw new TypeError('cannot specify @Body with method annotated with @Get');
  }

  return new Request(_makeUrl(conf.baseUrl, joinPath(conf.path, params.path), args.pathParams, args.queryParams), {
    body: args.body,
    headers: _.defaultsDeep(args.headers, conf.headers),
    method: method as string
  });
}

function _makeRequestParameters(request: Request, conf: SynapseApiConfig, params: EndpointParameters): RequestParameters {
  return {
    request,
    requestHandlers: [].concat(conf.requestHandlers || []).concat(params.requestHandlers || []),
    responseHandlers: [].concat(conf.responseHandlers || []).concat(params.responseHandlers || []),
  };
}

function _applyRequestHandlers(r: RequestParameters): RequestParameters {
  if (r.requestHandlers) {
    r.requestHandlers.forEach((h: HttpRequestHandler) => {
      h(r.request);
    });
  }

  return r;
}

function _returnTypeConverter(descriptor: TypedPropertyDescriptor<any>,
                              propertyKey: string | symbol): (promise: Promise<Response>) => EndpointReturnType {
  assert(_.isFunction(descriptor.value));
  let res: any = null;
  try {
    res = (descriptor.value as Function).apply(null);
  } catch (e) {
    console.warn(`cannot infer return type of function ${propertyKey}.`);
  }

  if (!res || res instanceof Observable) {
    return (p: Promise<Response>) => Observable.fromPromise(p);
  } else if (_.isFunction((res as any).then)) {
    return (p) => p;
  } else {
    const type = (res as any).__proto__ ? (res as any).__proto__.constructor.name : typeof  res;
    throw new TypeError(`Function ${propertyKey} returned object of unexpected type ${type}`);
  }
}
