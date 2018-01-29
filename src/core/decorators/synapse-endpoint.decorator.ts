import { cloneDeep, defaultsDeep, isArray, isFunction, isObject, isString, isUndefined, mergeWith } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { assert, joinPath, joinQueryParams, mergeConfigs, renameFn, SynapseError } from '../../utils';
import { Headers } from './parameters.decorator';
import { SynapseApiReflect } from './synapse-api.reflect';

import DecoratedArgs = SynapseApiReflect.DecoratedArgs;

import { SynapseApiConfig } from '../api-config.type';
import { ContentTypeConstants, HttpMethod, HttpRequestHandler, HttpResponseHandler, ObserveType } from '../constants';
import { EndpointConfig } from '../endpoint-config.type';
import { HttpBackendAdapter } from '../http-backend';
import { MapperType } from '../mapper.type';
import { SynapseApiClass } from '../synapse-api.type';
import { SynapseMethod } from '../synapse-method.type';
import { TypedResponse } from '../typed-response.model';
import { ResponseContentTypeConverter, ResponseContentTypeConverterStore } from './content-type-converters/rx/response-converter-store';
import { RequestContentTypeConverter, RequestConverterStore } from './content-type-converters/tx/request-converter-store';
import { PromiseConverterStore } from './promise-converters/promise-converter-store';

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
 * conf the configuration for this endpoint
 * the GET decorator
 */
export function GET(conf: EndpointConfig | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.GET, conf);
}

/**
 * POST method decorator.
 *
 * conf the configuration for this endpoint
 * the POST decorator
 */
export function POST(conf: EndpointConfig | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.POST, conf);
}

/**
 * PUT method decorator.
 *
 * conf the configuration for this endpoint
 * the PUT decorator
 */
export function PUT(conf: EndpointConfig | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PUT, conf);
}

/**
 * PATCH method decorator.
 *
 * conf the configuration for this endpoint
 * the PATCH decorator
 */
export function PATCH(conf: EndpointConfig | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PATCH, conf);
}

/**
 * DELETE method decorator.
 *
 * conf the configuration for this endpoint
 * the DELETE decorator
 */
export function DELETE(conf: EndpointConfig | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.DELETE, conf);
}

/**
 * Parameters available at runtime to create the Request object.
 */
interface RequestAndConf {
  request?: Request;
  conf: EndpointConfig & SynapseApiConfig;
}

type EndpointReturnType = Promise<Response> | Observable<Response>;

/**
 * Argument bundle that feed a method @GET, @POST, resolved at runtime.
 */
class CallArgs {
  pathParams?: string[];
  queryParams?: QueryParametersType;
  headers?: HeadersType;
  body?: {
    value: any,
    contentType: ContentTypeConstants
  };
}

function _httpRequestDecorator(method: HttpMethod, conf: EndpointConfig | string): MethodDecorator {
  return function HttpMethodDecorator(target: SynapseApiClass,
                                      propertyKey: string | symbol,
                                      descriptor: TypedPropertyDescriptor<any>): void {
    const original = descriptor.value;
    const endpointConf = _asEndpointConf(conf);

    const qId = endpointConf.path.indexOf('?');
    let parsedQueryParams = {};
    if (qId >= 0) {
      const queryString = endpointConf.path.substring(qId + 1);
      endpointConf.path = endpointConf.path.substring(0, qId);

      parsedQueryParams = JSON.parse(`{"${decodeURI(queryString)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')}"}`);
    }

    if (!isFunction(original)) {
      throw new TypeError(`@${method} should annotate methods only`);
    }

    const oldFn: SynapseMethod = descriptor.value;

    // replace method with implementation
    descriptor.value = (realTarget: SynapseApiClass): Function => {
      // do not only rely on target.
      // Target is proto of the class that defines this method. If we call in fact this method from a child class,
      // we need to gather conf of the child class, rather to get conf of the parent class where this method has been defined.
      // So, let class decorator feed the real overloaded target of child class
      const apiConf = realTarget.synapseConfig;

      const runtimeConf = mergeConfigs({method}, endpointConf, apiConf);
      let newFn = function(...args: any[]): any {
        // infer desired return type, and make a converter for it (Promise / Observable)
        const returnTypeConverter = _returnTypeConverter(oldFn, name);

        const decoratedArgs = SynapseApiReflect.getDecoratedArgs(target, propertyKey);
        const cargs: CallArgs = _parseArgs(args, decoratedArgs);
        _assertAllArgsAreDecorated(target, propertyKey, args, decoratedArgs);
        cargs.queryParams = _mergeQueryParams([parsedQueryParams, cargs.queryParams]);

        let promise: Promise<any>;
        promise = _makeRequestAndConf(method, apiConf, endpointConf, cargs)
          .then((requestAndConf: RequestAndConf) => {
            // execute the request
            return _doRequest(apiConf.httpBackend, requestAndConf);
          });

        // return result as a promise / observable.
        return returnTypeConverter(promise);
      };

      assert(typeof propertyKey === 'string');
      newFn = renameFn(newFn, `${propertyKey}`);

      Object.defineProperty(newFn, 'synapseConfig', {
        // TODO this is wrong. Should return apiConf & endpointConf
        get: () => runtimeConf
      });

      return newFn;
    };

    Object.defineProperty(descriptor.value, 'synapseConfig', {
      get: () => {
        throw new SynapseError('Cannot get synapseConfig of a method whose class has never been construct');
      }
    });
  };
}

function _makeRequestAndConf(method: HttpMethod,
                             apiConf: SynapseApiConfig,
                             endpointConf: EndpointConfig,
                             cargs: CallArgs): Promise<RequestAndConf> {
  if (method === HttpMethod.GET && cargs.body) {
    throw new TypeError('cannot specify @Body with method annotated with @Get');
  }

  // merge handlers
  const requestHandlers = [].concat(apiConf.requestHandlers || []).concat(endpointConf.requestHandlers || []);
  const responseHandlers = [].concat(apiConf.responseHandlers || []).concat(endpointConf.responseHandlers || []);

  let body, converter: RequestContentTypeConverter;
  const request = new Request(
    _makeUrl(apiConf.baseUrl,
      joinPath(apiConf.path, endpointConf.path),
      cargs.pathParams,
      cargs.queryParams
    ), {
      headers: defaultsDeep(cargs.headers, apiConf.headers),
      method: method as string
    });

  const requestAndConf = {
    request,
    conf: defaultsDeep({
      requestHandlers, responseHandlers,
    }, endpointConf, apiConf)
  };
  requestAndConf.conf.mapper = requestAndConf.conf.mapper ? requestAndConf.conf.mapper : (a: any) => a;

  if (cargs.body) {
    converter = _getRequestContentTypeConverter(cargs.body.contentType);
    body = cargs.body.value;

    const ctHeader = cargs.headers[Headers.CONTENT_TYPE];
    if (!isUndefined(ctHeader) && ctHeader.indexOf(cargs.body.contentType as string) <= 0) {
      throw new SynapseError(`Tried to send a @Body with Content-Type="${cargs.body.contentType}", \
but "Content-Type" header has already been set to "${cargs.headers[Headers.CONTENT_TYPE]}"`);
    }

    // convert body according to its Content-Type, and set proper headers
    return converter
      .convert(body, request)
      .then(r => {
        requestAndConf.request = r;

        return requestAndConf;
      });
  } else {
    return Promise.resolve(requestAndConf);
  }
}

function _getRequestContentTypeConverter(contentType: ContentTypeConstants): RequestContentTypeConverter {
  return RequestConverterStore.getConverterFor(contentType);
}

/**
 * Switch on {@link RequestAndConf.conf.observe}, and return either
 *  - a converter to map the body
 *  - a converter to create a copy of the response with the mapped body
 * requestConf
 */
function _getResponseContentTypeConverter(requestConf: RequestAndConf): ResponseContentTypeConverter<any> {
  return ResponseContentTypeConverterStore.getConverterFor(requestConf.conf.contentType);
}

function _toObservedReturnType<T>(requestConf: RequestAndConf, response: TypedResponse<T>): T | TypedResponse<T> {
  switch (requestConf.conf.observe) {
    case ObserveType.BODY:
      return response.body;

    case ObserveType.RESPONSE:
      return response;
    default:
      throw new TypeError(`Unhandled value for property "observe" : ${requestConf.conf.observe}`);
  }
}

function _doRequest(http: HttpBackendAdapter, requestConf: RequestAndConf): Promise<Response> {
  _applyRequestHandlers(requestConf);
  const m = `${requestConf.request.method}`.toLocaleLowerCase();
  const req = requestConf.request;
  if (!isFunction(http[m])) {
    throw new TypeError(`unexpected method : ${req.method}`);
  }

  const res: Promise<Response> = http[m](req);
  const converter = _getResponseContentTypeConverter(requestConf);

  // handle arrays automatically
  // TODO unit test this.
  const mapper = (response: any) => {
    if (isArray(response)) {
      response = response.map(requestConf.conf.mapper);

      return response;
    }

    return requestConf.conf.mapper(response);
  };

  return _assertIsResponsePromise(http, req.method, res)
    .then((response: Response) => _applyResponseHandlers(requestConf, response))
    .then(async r => new TypedResponse(mapper(await converter.convert(r)), r))
    .then(r => _toObservedReturnType(requestConf, r));
}

function _makeUrl(baseUrl: string, path: string, pathParams: PathParamsType[], queryParams: QueryParametersType): string {
  assert(!isUndefined(queryParams));
  assert(!isUndefined(pathParams));
  assert(!isUndefined(baseUrl));
  assert(!isUndefined(path));

  return joinQueryParams(joinPath(baseUrl, _replacePathParams(path, pathParams)), queryParams);
}

function _mergeQueryParams(queryParams: QueryParametersType[]): QueryParametersType {
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
      .map(i => args[i.index]));

  res.headers = decoratedArgs.headers
    .map(i => args[i.index])
    .reduce((previousValue, currentValue) => defaultsDeep(previousValue, currentValue), {});
  res.pathParams = decoratedArgs.path.map(i => args[i.index]);

  // if invoke a body
  if (decoratedArgs.body) {
    // get body runtime value
    res.body = {
      value: args[decoratedArgs.body.index],
      contentType: decoratedArgs.body.params.contentType
    };

    // if body comes with its mapper
    const mapper = decoratedArgs.body.params.mapper as MapperType<any, any>;
    if (mapper) {
      if (!isFunction(mapper)) {
        throw new TypeError(`mapper should be a function. Got ${mapper}`);
      }
      res.body.value = mapper(res.body.value);
      if (isUndefined(res.body.value)) {
        console.warn('Mapper returned value undefined');
      }
    }
  } else {
    res.body = undefined;
  }

  return res;
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

    if (isObject(p)) {
      throw new TypeError(`${path}: PathParams should be primitives. Got ${typeof p} for param #${i}`);
    }

    if (isUndefined(p) || p === '') {
      throw new TypeError(`${path}: missing value for path parameter #${i}`);
    }
    path = path.replace(PATH_PARAMS_REGEX, `${p}`);
    i++;
  });

  // if still some pathParams to replace
  const result = path.match(PATH_PARAMS_REGEX);

  if (result) {
    throw new Error(`path param "${result[0]}" not provided for url "${path}"`);
  }

  return path;
}

function _asEndpointConf(conf: EndpointConfig | string = ''): EndpointConfig {
  let conf_: EndpointConfig;
  if (isString(conf)) {
    conf_ = {
      path: conf as string
    };
  } else {
    conf_ = cloneDeep(conf) as EndpointConfig;
  }

  conf_.path = conf_.path || '';
  conf_.requestHandlers = conf_.requestHandlers || [];
  conf_.requestHandlers = conf_.requestHandlers || [];

  return conf_;
}

function _applyRequestHandlers(r: RequestAndConf): RequestAndConf {
  if (r.conf.requestHandlers) {
    r.conf.requestHandlers.forEach((h: HttpRequestHandler) => {
      h(r.request);
    });
  }

  return r;
}

function _applyResponseHandlers(requestAndConf: RequestAndConf, response: Response): Response {
  requestAndConf.conf.responseHandlers.forEach((h: HttpResponseHandler) => h(response));

  return response;
}

function _returnTypeConverter(fn: SynapseMethod,
                              name: string): (promise: Promise<Response>) => EndpointReturnType {
  assert(isFunction(fn));
  let res: any;
  try {
    res = fn.apply(undefined);
  } catch (e) {
    console.warn(`cannot infer return type of function ${name}.`);
  }

  const converter = PromiseConverterStore.getConverterFor(res);

  if (converter) {
    return converter.convert;
  } else {
    const type = ({} || res as any).__proto__ ? (res as any).__proto__.constructor.name : typeof res;
    throw new TypeError(`Function ${name} returned object of unexpected type ${type}`);
  }
}

/**
 * Ensure the given object is a Response. We consider that any httpBackendAdapter should return a Promise<Response>,
 * This function asserts that this is true.
 *
 */
export function _assertIsResponsePromise(http: HttpBackendAdapter, method: string, object: any): Promise<Response> {

  if (!object) {
    throw new SynapseError(`HttpBackendAdapter ${http.constructor.name} did not returned any value after calling method ${method}. \
That's an error. If you use your own HttpBackendAdapter implementation, please ensure it always returns a promise.`);
  } else if (!object.then) {
    throw new SynapseError(`HttpBackendAdapter ${http.constructor.name} did not returned a promise after calling method ${method}. \
(Got ${object}). If you use your own HttpBackendAdapter implementation, please ensure it always returns a promise.`);
  }

  return (object as Promise<any>).then((r: any) => {

    const mandatoryFields = ['headers', 'statusText', 'status'];
    const missing = mandatoryFields.filter(f => isUndefined(r[f]));

    if (missing.length) {
      throw new TypeError(`HttpBackendAdapter ${http.constructor.name} returned an object \
that does not look like a Response after calling method ${method}:
Missing fields: ${missing.join(', ')}. Got ${JSON.stringify(r)}`);
    }

    return r as Response;
  });
}

function _assertAllArgsAreDecorated(target: SynapseApiClass,
                                    propertyKey: string | symbol,
                                    args: any[], decoratedArgs: SynapseApiReflect.DecoratedArgs): void {

  const decoratedArgsIndexes = Object.keys(decoratedArgs)
    .map(k => [].concat(decoratedArgs[k]).map(v => v.index))
    .reduce((acc, current) => acc.concat(current), [])
    .sort((i: number, j: number) => j - i);

  const missingAgrs: number[] = [];
  args
    .forEach((value, index) => {
      if (decoratedArgsIndexes.indexOf(index) < 0) {
        missingAgrs.push(index);
      }
    });

  if (missingAgrs.length) {
    throw new SynapseError(
      `${target.constructor.name}.${propertyKey} : The following parameters are missing decorators : ${missingAgrs.join(', ')}`);
  }
}
