/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { assert } from '../../utils/assert';
import { SynapseApiReflect } from './synapse-api.reflect';
import { joinPath, joinQueryParams, mergeConfigs } from '../../utils/utils';
import { Headers } from '../core';
import { SynapseError } from '../../utils/synapse-error';
import { cloneDeep, defaultsDeep, isFunction, isString, isUndefined, mergeWith } from 'lodash';
import { HttpMethod, ObserveType } from '../constants';
import { ResponseContentTypeConverterStore } from './content-type-converters/rx/response-converter-store';
import { PromiseConverterStore } from './promise-converters/promise-converter-store';
import { RequestConverterStore } from './content-type-converters/tx/request-converter-store';
import { TypedResponse } from '../typed-response.model';
/**
 * Parameters decorated with \@Headers are considered to be of this type.
 * @record
 */
export function HeadersType() { }
function HeadersType_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    [k: string]: string | string[];
    */
}
/**
 * GET method decorator.
 *
 * @param {?=} conf
 * @return {?}
 */
export function GET(conf = '') {
    return _httpRequestDecorator(HttpMethod.GET, conf);
}
/**
 * POST method decorator.
 *
 * @param {?=} conf
 * @return {?}
 */
export function POST(conf = '') {
    return _httpRequestDecorator(HttpMethod.POST, conf);
}
/**
 * PUT method decorator.
 *
 * @param {?=} conf
 * @return {?}
 */
export function PUT(conf = '') {
    return _httpRequestDecorator(HttpMethod.PUT, conf);
}
/**
 * PATCH method decorator.
 *
 * @param {?=} conf
 * @return {?}
 */
export function PATCH(conf = '') {
    return _httpRequestDecorator(HttpMethod.PATCH, conf);
}
/**
 * DELETE method decorator.
 *
 * @param {?=} conf
 * @return {?}
 */
export function DELETE(conf = '') {
    return _httpRequestDecorator(HttpMethod.DELETE, conf);
}
/**
 * Parameters available at runtime to create the Request object.
 * @record
 */
function RequestAndConf() { }
function RequestAndConf_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    RequestAndConf.prototype.request;
    /** @type {?} */
    RequestAndConf.prototype.conf;
}
/**
 * Argument bundle that feed a method \@GET, \@POST, resolved at runtime.
 */
class CallArgs {
}
function CallArgs_tsickle_Closure_declarations() {
    /** @type {?} */
    CallArgs.prototype.pathParams;
    /** @type {?} */
    CallArgs.prototype.queryParams;
    /** @type {?} */
    CallArgs.prototype.headers;
    /** @type {?} */
    CallArgs.prototype.body;
}
/**
 * @param {?} method
 * @param {?} conf
 * @return {?}
 */
function _httpRequestDecorator(method, conf) {
    return function HttpMethodDecorator(target, propertyKey, descriptor) {
        const /** @type {?} */ original = descriptor.value;
        const /** @type {?} */ endpointConf = _asEndpointConf(conf);
        const /** @type {?} */ qId = endpointConf.path.indexOf('?');
        let /** @type {?} */ parsedQueryParams = {};
        if (qId >= 0) {
            const /** @type {?} */ queryString = endpointConf.path.substring(qId + 1);
            endpointConf.path = endpointConf.path.substring(0, qId);
            parsedQueryParams = JSON.parse(`{"${decodeURI(queryString)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')}"}`);
        }
        if (!isFunction(original)) {
            throw new TypeError(`@${method} should annotate methods only`);
        }
        // infer desired return type, and make a converter for it (Promise / Observable)
        const /** @type {?} */ returnTypeConverter = _returnTypeConverter(descriptor, propertyKey);
        descriptor.value = function (...args) {
            // tslint:disable no-invalid-this
            // do not only rely on target.
            // Target is proto of the annotated class of this method. If we call this method from a child class,
            // we rather want to get proto of this child class.
            let /** @type {?} */ apiConf = SynapseApiReflect.getConf((/** @type {?} */ (this)).__proto__);
            if (SynapseApiReflect.hasConf(target) && target !== (/** @type {?} */ (this)).__proto__) {
                // but also get config from parent class if any
                apiConf = mergeConfigs({}, apiConf, SynapseApiReflect.getConf(target));
            }
            // tslint:enable
            const /** @type {?} */ decoratedArgs = SynapseApiReflect.getDecoratedArgs(target, propertyKey);
            const /** @type {?} */ cargs = _parseArgs(args, decoratedArgs);
            cargs.queryParams = _mergeQueryParams([parsedQueryParams, cargs.queryParams]);
            const /** @type {?} */ promise = _makeRequestAndConf(method, apiConf, endpointConf, cargs)
                .then((requestAndConf) => {
                // execute the request
                return _doRequest(apiConf.httpBackend, requestAndConf);
            });
            // return result as a promise / observable.
            return returnTypeConverter(promise);
        };
    };
}
/**
 * @param {?} method
 * @param {?} apiConf
 * @param {?} endpointConf
 * @param {?} cargs
 * @return {?}
 */
function _makeRequestAndConf(method, apiConf, endpointConf, cargs) {
    if (method === HttpMethod.GET && cargs.body) {
        throw new TypeError('cannot specify @Body with method annotated with @Get');
    }
    // merge handlers
    const /** @type {?} */ requestHandlers = [].concat(apiConf.requestHandlers || []).concat(endpointConf.requestHandlers || []);
    const /** @type {?} */ responseHandlers = [].concat(apiConf.responseHandlers || []).concat(endpointConf.responseHandlers || []);
    let /** @type {?} */ body, /** @type {?} */ converter;
    const /** @type {?} */ request = new Request(_makeUrl(apiConf.baseUrl, joinPath(apiConf.path, endpointConf.path), cargs.pathParams, cargs.queryParams), {
        headers: defaultsDeep(cargs.headers, apiConf.headers),
        method: /** @type {?} */ (method)
    });
    const /** @type {?} */ requestAndConf = {
        request,
        conf: defaultsDeep({
            requestHandlers, responseHandlers,
            mapper: endpointConf.mapper ? endpointConf.mapper : (a) => a
        }, endpointConf, apiConf)
    };
    if (cargs.body) {
        converter = _getRequestContentTypeConverter(cargs.body.contentType);
        body = cargs.body.value;
        const /** @type {?} */ ctHeader = cargs.headers[Headers.CONTENT_TYPE];
        if (!isUndefined(ctHeader) && ctHeader.indexOf(/** @type {?} */ (cargs.body.contentType)) <= 0) {
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
    }
    else {
        return Promise.resolve(requestAndConf);
    }
}
/**
 * @param {?} contentType
 * @return {?}
 */
function _getRequestContentTypeConverter(contentType) {
    return RequestConverterStore.getConverterFor(contentType);
}
/**
 * Switch on {\@link RequestAndConf.conf.observe}, and return either
 *  - a converter to map the body
 *  - a converter to create a copy of the response with the mapped body
 * @param {?} requestConf
 * @return {?}
 */
function _getResponseContentTypeConverter(requestConf) {
    return ResponseContentTypeConverterStore.getConverterFor(requestConf.conf.contentType);
}
/**
 * @template T
 * @param {?} requestConf
 * @param {?} response
 * @return {?}
 */
function _toObservedReturnType(requestConf, response) {
    switch (requestConf.conf.observe) {
        case ObserveType.BODY:
            return response.body;
        case ObserveType.RESPONSE:
            return response;
        default:
            throw new TypeError(`Unhandled value for property "observe" : ${requestConf.conf.observe}`);
    }
}
/**
 * @param {?} http
 * @param {?} requestConf
 * @return {?}
 */
function _doRequest(http, requestConf) {
    _applyRequestHandlers(requestConf);
    const /** @type {?} */ m = `${requestConf.request.method}`.toLocaleLowerCase();
    const /** @type {?} */ req = requestConf.request;
    if (!isFunction(http[m])) {
        throw new TypeError(`unexpected method : ${req.method}`);
    }
    const /** @type {?} */ res = http[m](req);
    const /** @type {?} */ converter = _getResponseContentTypeConverter(requestConf);
    return _assertIsResponsePromise(http, req.method, res)
        .then((response) => _applyResponseHandlers(requestConf, response))
        .then((r) => tslib_1.__awaiter(this, void 0, void 0, function* () { return new TypedResponse(requestConf.conf.mapper(yield converter.convert(r)), r); }))
        .then(r => _toObservedReturnType(requestConf, r));
}
/**
 * @param {?} baseUrl
 * @param {?} path
 * @param {?} pathParams
 * @param {?} queryParams
 * @return {?}
 */
function _makeUrl(baseUrl, path, pathParams, queryParams) {
    assert(!isUndefined(queryParams));
    assert(!isUndefined(pathParams));
    assert(!isUndefined(baseUrl));
    assert(!isUndefined(path));
    return joinQueryParams(joinPath(baseUrl, _replacePathParams(path, pathParams)), queryParams);
}
/**
 * @param {?} queryParams
 * @return {?}
 */
function _mergeQueryParams(queryParams) {
    return mergeWith({}, ...queryParams.filter(a => !isUndefined(a)), (objValue, srcValue, key, object /*, source: any, stack: any */) => {
        if (isUndefined(objValue)) {
            object[key] = srcValue;
        }
        else {
            if (!isUndefined(srcValue)) {
                const /** @type {?} */ o = [].concat(objValue);
                o.push(srcValue);
                object[key] = o;
            }
        }
        return object[key];
    });
}
/**
 * @param {?} args
 * @param {?} decoratedArgs
 * @return {?}
 */
function _parseArgs(args, decoratedArgs) {
    const /** @type {?} */ res = new CallArgs();
    res.queryParams = _mergeQueryParams(decoratedArgs.query
        .map(i => args[i]));
    res.headers = decoratedArgs.headers
        .map(i => args[i])
        .reduce((previousValue, currentValue) => defaultsDeep(previousValue, currentValue), {});
    res.pathParams = decoratedArgs.path.map(i => args[i]);
    // if invoke a body
    if (decoratedArgs.body) {
        // get body runtime value
        res.body = {
            value: args[decoratedArgs.body.index],
            contentType: decoratedArgs.body.params.contentType
        };
        // if body comes with its mapper
        const /** @type {?} */ mapper = /** @type {?} */ (decoratedArgs.body.params.mapper);
        if (mapper) {
            if (!isFunction(mapper)) {
                throw new TypeError(`mapper should be a function. Got ${mapper}`);
            }
            res.body.value = mapper(res.body.value);
            if (isUndefined(res.body.value)) {
                console.warn('Mapper returned value undefined');
            }
        }
    }
    else {
        res.body = undefined;
    }
    return res;
}
/**
 * @param {?} path
 * @param {?=} pathParams
 * @return {?}
 */
function _replacePathParams(path, pathParams = []) {
    let /** @type {?} */ i = 0;
    const /** @type {?} */ PATH_PARAMS_REGEX = /:[A-Za-z\d]+/;
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
    const /** @type {?} */ result = path.match(PATH_PARAMS_REGEX);
    if (result) {
        throw new Error(`path param "${result[0]}" not provided for url "${path}"`);
    }
    return path;
}
/**
 * @param {?=} conf
 * @return {?}
 */
function _asEndpointConf(conf = '') {
    let /** @type {?} */ conf_;
    if (isString(conf)) {
        conf_ = {
            path: /** @type {?} */ (conf)
        };
    }
    else {
        conf_ = /** @type {?} */ (cloneDeep(conf));
    }
    conf_.path = conf_.path || '';
    conf_.requestHandlers = conf_.requestHandlers || [];
    conf_.requestHandlers = conf_.requestHandlers || [];
    return conf_;
}
/**
 * @param {?} r
 * @return {?}
 */
function _applyRequestHandlers(r) {
    if (r.conf.requestHandlers) {
        r.conf.requestHandlers.forEach((h) => {
            h(r.request);
        });
    }
    return r;
}
/**
 * @param {?} requestAndConf
 * @param {?} response
 * @return {?}
 */
function _applyResponseHandlers(requestAndConf, response) {
    requestAndConf.conf.responseHandlers.forEach((h) => h(response));
    return response;
}
/**
 * @param {?} descriptor
 * @param {?} propertyKey
 * @return {?}
 */
function _returnTypeConverter(descriptor, propertyKey) {
    assert(isFunction(descriptor.value));
    let /** @type {?} */ res;
    try {
        res = (/** @type {?} */ (descriptor.value)).apply(undefined);
    }
    catch (/** @type {?} */ e) {
        console.warn(`cannot infer return type of function ${propertyKey}.`);
    }
    const /** @type {?} */ converter = PromiseConverterStore.getConverterFor(res);
    if (converter) {
        return converter.convert;
    }
    else {
        const /** @type {?} */ type = ({} || /** @type {?} */ (res)).__proto__ ? (/** @type {?} */ (res)).__proto__.constructor.name : typeof res;
        throw new TypeError(`Function ${propertyKey} returned object of unexpected type ${type}`);
    }
}
/**
 * Ensure the given object is a Response. We consider that any httpBackendAdapter should return a Promise<Response>,
 * This function asserts that this is true.
 *
 * @param {?} http
 * @param {?} method
 * @param {?} object
 * @return {?}
 */
export function _assertIsResponsePromise(http, method, object) {
    if (!object) {
        throw new SynapseError(`HttpBackendAdapter ${http.constructor.name} did not returned any value after calling method ${method}. \
That's an error. If you use your own HttpBackendAdapter implementation, please ensure it always returns a promise.`);
    }
    else if (!object.then) {
        throw new SynapseError(`HttpBackendAdapter ${http.constructor.name} did not returned a promise after calling method ${method}. \
(Got ${object}). If you use your own HttpBackendAdapter implementation, please ensure it always returns a promise.`);
    }
    return (/** @type {?} */ (object)).then((r) => {
        const /** @type {?} */ mandatoryFields = ['headers', 'statusText', 'status'];
        const /** @type {?} */ missing = mandatoryFields.filter(f => isUndefined(r[f]));
        if (missing.length) {
            throw new TypeError(`HttpBackendAdapter ${http.constructor.name} returned an object \
that does not look like a Response after calling method ${method}:
Missing fields: ${missing.join(', ')}. Got ${JSON.stringify(r)}`);
        }
        return /** @type {?} */ (r);
    });
}
//# sourceMappingURL=synapse-endpoint.decorator.js.map