/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as qs from 'qs';
import { cloneDeep, isArray, isFunction, isObject, isUndefined, mergeWith } from 'lodash';
import { assert } from './assert';
/**
 * @param {?} path
 * @return {?}
 */
export function removeTrailingSlash(path) {
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    return path;
}
/**
 * @param {...?} path
 * @return {?}
 */
export function joinPath(...path) {
    return path.map(p => removeTrailingSlash(p))
        .filter(p => !!p)
        .join('/');
}
/**
 * @param {?} queryParameters
 * @return {?}
 */
export function toQueryString(queryParameters) {
    return qs.stringify(queryParameters);
}
/**
 * @param {?} queryString
 * @return {?}
 */
export function fromQueryString(queryString) {
    return qs.parse(queryString);
}
/**
 * @param {?} url
 * @param {?} queryParams
 * @return {?}
 */
export function joinQueryParams(url, queryParams) {
    const /** @type {?} */ queryString = toQueryString(queryParams);
    return [removeTrailingSlash(url), queryString].filter(s => !!s).join('?');
}
/**
 * @param {?} ba
 * @return {?}
 */
export function validateHttpBackendAdapter(ba) {
    const /** @type {?} */ mandatoryFn = ['get', 'post', 'put', 'patch', 'delete'];
    for (const /** @type {?} */ fn of mandatoryFn) {
        if (!isFunction(ba[fn])) {
            assert(false);
            throw new TypeError(`provided backend adapter is invalid: Does not have the function ${fn}`);
        }
    }
}
/**
 * @template T, U
 * @param {?} conf
 * @param {...?} confs
 * @return {?}
 */
export function mergeConfigs(conf, ...confs) {
    return mergeWith(conf, ...confs, (value, srcValue, key, object, source) => {
        if (key === 'httpBackend') {
            return value;
        }
        if (source.hasOwnProperty(key)) {
            if (isArray(value)) {
                return value.concat(srcValue);
            }
            else {
                if (isUndefined(object[key])) {
                    return cloneDeep(source[key]);
                }
                else {
                    if (isObject(object[key]) || isArray(object[key])) {
                        return mergeConfigs(object[key], source[key]);
                    }
                    else {
                        return object[key];
                    }
                }
            }
        }
    });
}
//# sourceMappingURL=utils.js.map