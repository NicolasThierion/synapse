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
import {
  isFunction, isString,
  defaultsDeep, noop,
  isUndefined,
  mergeWith,
  cloneDeep,
} from 'lodash';

/**
 * Use this conf for @GET, @POST, ...
 */
export interface EndpointConf {
  // TODO support for mappers
  // TODO support for handler
  path?: string;
  mapper?: MapperType<any, any>;
  requestHandlers?: HttpRequestHandler[];
  responseHandlers?: HttpResponseHandler[];
}

/**
 * Parameters decorated with @Headers are considered to be of this type.
 */
export interface HeadersType {
  [k: string]: string | string[];
}

/**
 * Parameters decorated with @PathParam are considered to be of this type.
 */
export type PathParamsType = string | number | boolean;

/**
 * Parameters decorated with @QueryParams are considered to be of this type.
 */
export type QueryParametersType = Object;

/**
 * GET method decorator.
 *
 * @param {EndpointConf | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the GET decorator
 */
export function GET(conf: EndpointConf | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.GET, conf);
}

/**
 * POST method decorator.
 *
 * @param {EndpointConf | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the POST decorator
 */
export function POST(conf: EndpointConf | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.POST, conf);
}

/**
 * PUT method decorator.
 *
 * @param {EndpointConf | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the PUT decorator
 */
export function PUT(conf: EndpointConf | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PUT, conf);
}

/**
 * PATCH method decorator.
 *
 * @param {EndpointConf | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the PATCH decorator
 */
export function PATCH(conf: EndpointConf | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PATCH, conf);
}

/**
 * DELETE method decorator.
 *
 * @param {EndpointConf | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the DELETE decorator
 */
export function DELETE(conf: EndpointConf | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.DELETE, conf);
}

/**
 * Parameters available at runtime to create the Request object.
 */
interface RequestParameters {
  request: Request;
  requestHandlers: HttpRequestHandler[];
  responseHandlers: HttpResponseHandler[];
}

type EndpointReturnType = Promise<Response> | Observable<Response>;

/**
 * Argument bundle that feed a method @GET, @POST, resolved at runtime.
 */
class CallArgs {
  pathParams?: string[];
  queryParams?: QueryParametersType;
  headers?: HeadersType;
  body?: any;
}

function _httpRequestDecorator(method: HttpMethod, params: EndpointConf | string): MethodDecorator {
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

    if (!isFunction(original)) {
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
        conf = defaultsDeep(conf, SynapseApiReflect.getConf(target));
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
  const m = `${HttpMethod.GET}`.toLocaleLowerCase();
  if (!isFunction(http[m])) {
    throw new TypeError(`unexpected method : ${r.method}`);
  }

  const r = requestParams.request;
  const res: Promise<Response> = http[m](r);

  if (!res) {
    throw new SynapseError(`HttpBackendAdapter ${http.constructor.name} did not returned any value after calling method ${r.method}.
     That's an error. If you use your own HttpBackendAdapter implementation, please ensure it always returns a promise.`);
  } else if (!res.then) {
    throw new SynapseError(`HttpBackendAdapter ${http.constructor.name} did not returned a promise after calling method ${r.method}.
     (Got ${res}). If you use your own HttpBackendAdapter implementation, please ensure it always returns a promise.`);
  }

  return res;
}

function _makeUrl(baseUrl: string, path: string, pathParams: PathParamsType[], queryParams: QueryParametersType): string {
  assert(!isUndefined(queryParams));
  assert(!isUndefined(pathParams));
  assert(!isUndefined(baseUrl));
  assert(!isUndefined(path));
  return joinQueryParams(joinPath(baseUrl, _replacePathParams(path, pathParams)), queryParams);
}

function _mergeQueryParams(queryParams: QueryParametersType[]) {
  return mergeWith({}, ...queryParams.filter(a => !isUndefined(a)),
    (objValue: any, srcValue: any, key: string, object: any /*, source: any, stack: any */) => {
      if (isUndefined(objValue)) {
        object[key] = srcValue;
      } else {
        if (!isUndefined(srcValue)) {
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
    .reduce((previousValue, currentValue) => defaultsDeep(previousValue, currentValue), {});
  res.pathParams = decoratedArgs.path.map(i => args[i]);

  // if invoke a body
  if (decoratedArgs.body) {
    // get body runtime value
    res.body = args[decoratedArgs.body.index];
    // if body comes with its mapper
    const mapper = decoratedArgs.body.params.mapper as MapperType<any, any>;
    if (mapper) {
      if (!isFunction(mapper)) {
        throw new TypeError(`mapper should be a function. Got ${mapper}`);
      }
      res.body = mapper(res.body);
      if (isUndefined(res.body)) {
        console.warn(`Mapper returned value undefined`);
      }
    }

    if (!isUndefined(res.body)) {
      // get any present Content-Type
      const contentType = decoratedArgs.body.params.contentType;

      // converts body value according to this content type.
      res.body = _wrapBody(contentType, res);
    }
  } else {
    res.body = undefined;
  }

  return res;
}

function _wrapBody(contentType: ContentType, callArgs: CallArgs): any {
  // TODO support other formats
  const getContentType = () => callArgs.headers['Content-Type'];
  const setContentType = (ct) => callArgs.headers['Content-Type'] = ct;

  if (getContentType() && contentType !== getContentType()) {
    throw new SynapseError(`Tried to send a @Body with Content-Type="${contentType}", but "Content-Type" header has already been set to "${getContentType()}"`);
  }

  switch (contentType) {
    case ContentType.JSON:
      setContentType(contentType);

      return JSON.stringify(callArgs.body);
    case ContentType.X_WWW_URL_ENCODED:
      return new URLSearchParams(toQueryString(callArgs.body));
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
    if (isUndefined(p)) {
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

function _asEndpointParameters(params: EndpointConf | string = ''): EndpointConf {
  let params_: EndpointConf;
  if (isString(params)) {
    params_ = {
      path: params as string
    };
  } else {
    params_ = cloneDeep(params) as EndpointConf;
  }

  params_.path = params_.path || '';
  params_.requestHandlers = params_.requestHandlers || [];

  return params_;
}

function _createRequest(method: HttpMethod,
                        args: CallArgs,
                        params: EndpointConf,
                        conf: SynapseApiConfig): Request {
  if (method === HttpMethod.GET && args.body) {
    throw new TypeError('cannot specify @Body with method annotated with @Get');
  }

  return new Request(_makeUrl(conf.baseUrl, joinPath(conf.path, params.path), args.pathParams, args.queryParams), {
    body: args.body,
    headers: defaultsDeep(args.headers, conf.headers),
    method: method as string
  });
}

function _makeRequestParameters(request: Request, conf: SynapseApiConfig, params: EndpointConf): RequestParameters {
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
  assert(isFunction(descriptor.value));
  let res: any = null;
  try {
    res = (descriptor.value as Function).apply(null);
  } catch (e) {
    console.warn(`cannot infer return type of function ${propertyKey}.`);
  }

  if (!res || res instanceof Observable) {
    return (p: Promise<Response>) => Observable.fromPromise(p);
  } else if (isFunction((res as any).then)) {
    if (res.catch) {
      (res as Promise<any>).catch(noop);  // 'handle' the Synapse.PROMISE error to mute chrome warning
    }
    return (p) => p;
  } else {
    const type = (res as any).__proto__ ? (res as any).__proto__.constructor.name : typeof  res;
    throw new TypeError(`Function ${propertyKey} returned object of unexpected type ${type}`);
  }
}
