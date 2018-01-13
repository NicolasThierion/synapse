/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { SynapseApiReflect } from './synapse-api.reflect';
import { assign, defaults, isString } from 'lodash';
import { ContentTypeConstants, HeaderConstants } from '../constants';
/**
 * Use this decorator on a parameter to specify that it should be considered as a path parameter.
 * The mapped parameter should be either a string, a number or a boolean. Any other type will throw an error.
 *
 * @return {?}
 */
export function PathParam() {
    return SynapseApiReflect.addPathParamArg();
}
/**
 * Use this decorator on a parameter to specify that it should be considered as a query parameter.
 * @return {?}
 */
export function QueryParams() {
    return SynapseApiReflect.addQueryParamsArg();
}
/**
 * Use this decorator on a parameter to specify that it should be considered as a header.
 * The given headers will be merged with any specified global header.
 * If you use multiple {\@code Headers} decorators for a method, header will be merged as well.
 * @return
 */
export const /** @type {?} */ Headers = assign(() => {
    return SynapseApiReflect.addHeadersArg();
}, HeaderConstants);
/**
 * Use this decorator on a parameter to specify that it should be considered as a body. Can be used once at most per method.
 * @return
 */
export const /** @type {?} */ Body = assign((params = ContentTypeConstants.JSON) => {
    const /** @type {?} */ params_ = defaults(isString(params) ? {
        contentType: /** @type {?} */ (params)
    } : /** @type {?} */ (params), {
        contentType: ContentTypeConstants.JSON
    });
    return SynapseApiReflect.addBodyArg(params_);
}, {
    ContentType: ContentTypeConstants
});
/**
 * @record
 */
export function BodyParams() { }
function BodyParams_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    BodyParams.prototype.contentType;
    /** @type {?|undefined} */
    BodyParams.prototype.mapper;
}
//# sourceMappingURL=parameters.decorator.js.map