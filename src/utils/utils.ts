import { QueryParametersType } from '../';
import * as qs from 'qs';
import { HttpBackendAdapter } from '../core/http-backend';
import { isFunction, mergeWith, isUndefined, isObject, isArray, cloneDeep } from 'lodash';
import { SynapseConfig } from '../core/config.type';
import { assert } from './assert';
import { SynapseApiConfig } from '../core/api-config.type';
import { EndpointConfig } from '../core/endpoint-config.type';

export function removeTrailingSlash(path: string): string {
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  return path;
}

export function joinPath(...path: string[]): string {
  return path.map(p => removeTrailingSlash(p))
    .filter(p => !!p)
    .join('/');
}

export function toQueryString(queryParameters: QueryParametersType | Object): string {
 return qs.stringify(queryParameters);
}

export function fromQueryString(queryString: string): Object {
  return qs.parse(queryString);
}

export function joinQueryParams(url: string, queryParams: QueryParametersType): string {
  const queryString = toQueryString(queryParams);
  return [removeTrailingSlash(url), queryString].filter(s => !!s).join('?');
}

export function validateHttpBackendAdapter(ba: HttpBackendAdapter): void {
  const mandatoryFn = ['get', 'post', 'put', 'patch', 'delete'];
  for (const fn of mandatoryFn) {
    if (!isFunction(ba[fn])) {
      assert(false);
      throw new TypeError(`provided backend adapter is invalid: Does not have the function ${fn}`);
    }
  }
}

type CONF = SynapseConfig | SynapseApiConfig | EndpointConfig;
export function mergeConfigs<T extends CONF, U extends CONF> (conf: T, ...confs: U[] ): T & U {

  return mergeWith(conf, ...confs, (value: any, srcValue: any, key: string, object: any, source: any) => {
    if (key === 'httpBackend') {
      return value;
    }

    if (source.hasOwnProperty(key)) {
      if (isArray(value)) {
        return value.concat(srcValue);
      } else {
        if (isUndefined(object[key])) {
          return cloneDeep(source[key]);
        } else {
          if (isObject(object[key]) || isArray(object[key])) {
            return mergeConfigs(object[key], source[key]);
          } else {
            return object[key];
          }
        }
      }
    }
  });
}
