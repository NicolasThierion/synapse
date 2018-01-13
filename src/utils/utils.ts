import { cloneDeep, isArray, isFunction, isObject, isUndefined, mergeWith } from 'lodash';
import { parse, stringify } from 'qs';
import { EndpointConfig, QueryParametersType, SynapseApiConfig, SynapseConfig } from '../';
import { assert } from './assert';
import { HttpBackendAdapter } from '../core/http-backend';

export type Constructor<T> = Function & {
  new(...args: any[]): T;
};

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
  return stringify(queryParameters);
}

export function fromQueryString(queryString: string): Object {
  return parse(queryString);
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

export type SynapseMergedConfig = SynapseConfig | SynapseApiConfig | EndpointConfig;

export function mergeConfigs<T extends SynapseMergedConfig, U extends SynapseMergedConfig>(conf: T, ...confs: U[]): T & U {

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
