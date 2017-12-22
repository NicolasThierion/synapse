import { SynapseApiConfig } from './synapse-api.decorator';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { SynapseConf } from '../synapse-conf';
import { assert } from '../../utils/assert';
import { SynapseApiReflect } from './synapse-api.reflect';
import DecoratedArgs = SynapseApiReflect.DecoratedArgs;

class CallArgs {
  pathParams?: string[];
  queryParams?: Object;
  headers?: Object;
  body?: Object;
}

enum HttpMethod {
  GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE', OPTION = 'OPTION', PATCH = 'PATCH'
}

export interface EndpointParameters {
  // TODO support for mappers
  // TODO support for handler
  url?: string;
}

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

export function DELETE(params: EndpointParameters | string  = ''): MethodDecorator {
  return _httpRequestDecorator(HttpMethod.DELETE, params);
}

function _httpRequestDecorator(method: HttpMethod, params: EndpointParameters | string): MethodDecorator {
  return function HttpMethodDecorator(target: Object,
                                      propertyKey: string | symbol,
                                      descriptor: TypedPropertyDescriptor<any>): void {
    const original = descriptor.value;
    const params_ = asEndpointParameters(params);

    if (!_.isFunction(original)) {
      throw new TypeError(`@${method} should annotate methods only`);
    }

    descriptor.value = function(...args: any[]): Observable<Object> {
      const conf = SynapseApiReflect.getConf(target);
      const decoratedArgs = SynapseApiReflect.getDecoratedArgs(target, propertyKey);
      const {pathParams, queryParams, headers, body}: CallArgs = _parseArgs(args, decoratedArgs);

      return _doRequest(method, conf, pathParams, queryParams, headers, body);
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
  return _replacePathParams(`${conf.baseUrl}${conf.path}`, pathParams);
}

function _parseArgs(args: any[], decoratedArgs: DecoratedArgs): CallArgs {
  assert(decoratedArgs.body.length <= 1);

  const res = new CallArgs();
  res.queryParams = _.defaultsDeep({}, decoratedArgs.query
    .map(i => args[i])
    .filter(a => !_.isUndefined(a))
  );
  res.headers = _.defaultsDeep({}, decoratedArgs.headers.map(i => args[i]));
  res.pathParams = decoratedArgs.path.map(i => args[i]);
  res.body = decoratedArgs.body.length ? _.cloneDeep(decoratedArgs.body[0]) : null;

  return res;
}

function _replacePathParams(path: string, pathParams: (string | number)[] = []): string {
  let i = 0;
  pathParams.forEach(p => {
    path = path.replace(`:[A-Za-z]`, `${p}`);
    if (_.isUndefined(p)) {
      throw new TypeError(`${path} : value for path parameter #${i} is undefined`);
    }
    i++;
  });

  const result = path.match(/:[A-Za-z]+/g);

  if (result) {
    throw new Error(`path param (${result[0]}) not provided for url (${path}`);
  }

  return path;
}

function asEndpointParameters(params: EndpointParameters  | string = ''): EndpointParameters {
  const url: string = _.isString(params) ? params as string : ((params as EndpointParameters).url || '');
  return {
    url
  };
}
