/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { SynapseApiReflect } from './synapse-api.reflect';
import { cloneDeep, isFunction, isString } from 'lodash';
/**
 * Use this decorator on your web API class.
 *
 * You can specify an optional resource path to this API, or a complete {\@link SynapseApiConfig},
 * that will applies to this class and all of its sub classes.
 *
 * @param {?=} confOrCtor
 * @return {?}
 */
export function SynapseApi(confOrCtor = '') {
    // if called SynapseApi(...???...)
    if (!isFunction(confOrCtor)) {
        return (ctor) => {
            if (!ctor) {
                throw new Error('assertion error');
            }
            confOrCtor = isString(confOrCtor) ? { path: /** @type {?} */ (confOrCtor) } : /** @type {?} */ (cloneDeep(confOrCtor));
            return _makeNewCtor(ctor, confOrCtor);
        };
    }
    else {
        // if called SynapseApi
        return _makeNewCtor(/** @type {?} */ (confOrCtor), { path: '' });
    }
    /**
     * @param {?} ctor
     * @param {?} conf
     * @return {?}
     */
    function _makeNewCtor(ctor, conf) {
        // decorate constructor to add config within reflect metadata
        let /** @type {?} */ newCtor = /** @type {?} */ (function (...args) {
            // call decoree constructor
            const /** @type {?} */ res = ctor.apply(/** @type {?} */ (this), args); // tslint:disable-line
            // store conf within metadata.
            // !!! It is important to call constructor before, to register config of any parent class decorated with @SynapseApi
            SynapseApiReflect.init(ctor.prototype, conf);
            return res;
        });
        newCtor = renameFn(newCtor, ctor.prototype.constructor.name);
        newCtor.prototype = ctor.prototype;
        // copy static values
        Object.keys(ctor).forEach(k => newCtor[k] = ctor[k]);
        return newCtor;
    }
    /**
     * @template T
     * @param {?} fn
     * @param {?} name
     * @return {?}
     */
    function renameFn(fn, name) {
        return /** @type {?} */ (new Function('fn', `return function ${name}() {\n return fn.apply(this, arguments);\n}`)(fn));
    }
}
//# sourceMappingURL=synapse-api.decorator.js.map