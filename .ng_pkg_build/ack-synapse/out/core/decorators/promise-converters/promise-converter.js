/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { isFunction, noop } from 'lodash';
export class PromiseConverterImpl {
    /**
     * @template T
     * @param {?} promise
     * @return {?}
     */
    convert(promise) {
        return promise;
    }
    /**
     * @param {?} convertTo
     * @return {?}
     */
    accept(convertTo) {
        const /** @type {?} */ isPromise = isFunction((/** @type {?} */ (convertTo)).then);
        if (isPromise) {
            const /** @type {?} */ promise = /** @type {?} */ (convertTo);
            if (promise.catch) {
                (promise).catch(noop); // 'handle' the Synapse.PROMISE error to mute chrome warning
            }
        }
        return isPromise;
    }
}
//# sourceMappingURL=promise-converter.js.map