import { SynapseApiConfig } from './synapse-api.decorator';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { SynapseConf } from '../synapse-conf';
import { assert } from '../../utils/assert';
import { SynapseApiReflect } from './synapse-api.reflect';
import { joinPath } from '../../utils/utils';
import DecoratedArgs = SynapseApiReflect.DecoratedArgs;

class CallArgs {
  pathParams?: string[];
  queryParams?: Object;
  headers?: Object;
  body?: Object;
}

enum HttpMethod {
  GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE', PATCH = 'PATCH'
}

export interface EndpointParameters {
  // TODO support for mappers
  // TODO support for handler
  url?: string;
}

export function GET(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.GET, params);
}

// TODO let choice between 'form-data', 'x-www-form-urlencoded', 'raw' or 'binary'
export function POST(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.POST, params);
}

export function PUT(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PUT, params);
}

export function PATCH(params: EndpointParameters | string = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.PATCH, params);
}

export function DELETE(params: EndpointParameters | string  = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.DELETE, params);
}

function _httpRequestDecorator(method: HttpMethod, params: EndpointParameters | string): MethodDecorator {
  return function HttpMethodDecorator(target: Object,
                                      propertyKey: string | symbol,
                                      descriptor: TypedPropertyDescriptor<any>): void {
    const original = descriptor.value;
    const params_ = asEndpointParameters(params);

    const qId = params_.url.indexOf('?');
    let parsedQueryParams = {};
    if (qId >= 0) {
      const queryString = params_.url.substring(qId + 1);
      params_.url = params_.url.substring(0, qId);

      parsedQueryParams = JSON.parse(`{"${decodeURI(queryString)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')}"}`);
    }

    if (!_.isFunction(original)) {
      throw new TypeError(`@${method} should annotate methods only`);
    }
    descriptor.value = function(...args: any[]): Observable<Object> {

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
      _mergeConfig(cargs, params_, conf);

      const {pathParams, queryParams, headers, body} = cargs;

      return _doRequest(method,
        conf,
        pathParams,
        _mergeQueryParams([parsedQueryParams, queryParams]),
        headers,
        body);
    };
  };
}

function _doRequest(method: HttpMethod,
                    conf: SynapseApiConfig & SynapseConf,
                    pathParams?: string[],
                    queryParams?: Object,
                    headers?: Object,
                    body?: Object): Observable<Object> {
  assert(conf.httpBackend);

  const url = _makeUrl(conf, pathParams);

  switch (method) {
    case HttpMethod.GET:

      if (body) {
        throw new TypeError('cannot specify @Body with method annotated with @Get');
      }
      return conf.httpBackend.get(url, queryParams, headers);
    case HttpMethod.POST:
      return conf.httpBackend.post(url, body, queryParams, headers);
    case HttpMethod.PUT:
      return conf.httpBackend.put(url, body, queryParams, headers);
    case HttpMethod.DELETE:
      if (body) {
        throw new TypeError('cannot specify @Body with method annotated with @Delete');
      }
      return conf.httpBackend.delete(url, queryParams, headers);
    case HttpMethod.PATCH:
      return conf.httpBackend.patch(url, body, queryParams, headers);
    default:
      throw new TypeError(`unexpected method : ${method}`);
  }
}

function _makeUrl(conf: SynapseApiConfig & SynapseConf, pathParams?: string[]): string {
  // TODO sanitize.
  // TODO check path parameters
  // TODO populate path parameters
  return joinPath(conf.baseUrl, _replacePathParams(conf.path, pathParams));
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
  assert(decoratedArgs.body.length <= 1);

  const res = new CallArgs();
  res.queryParams = _mergeQueryParams(
    decoratedArgs.query
      .map(i => args[i]));

  res.headers = decoratedArgs.headers
    .map(i => args[i])
    .reduce((previousValue, currentValue) => _.defaultsDeep(previousValue, currentValue), {});
  res.pathParams = decoratedArgs.path.map(i => args[i]);
  res.body = decoratedArgs.body.length ? _.cloneDeep(args[decoratedArgs.body[0]]) : null;

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

function asEndpointParameters(params: EndpointParameters  | string = ''): EndpointParameters {
  const url: string = _.isString(params) ? params as string : ((params as EndpointParameters).url || '');
  return {
    url
  };
}

function _mergeConfig(args: CallArgs, params: EndpointParameters, conf: SynapseApiConfig & SynapseConf) {
  args.headers = _.defaultsDeep(args.headers, conf.headers);
  conf.path = joinPath(params.url, conf.path);
}
