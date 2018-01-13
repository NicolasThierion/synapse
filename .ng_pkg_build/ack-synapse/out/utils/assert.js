/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} condition
 * @param {?=} message
 * @return {?}
 */
export function assert(condition, message) {
    _assertFn(condition, message);
}
/**
 * @param {?} enable
 * @return {?}
 */
export function initAssert(enable) {
    _assertFn = _makeAssertFn(enable);
}
let /** @type {?} */ _assertFn = () => {
    throw new Error('Asserts needs environment. Cannot use assert until "initAssert" is called');
};
const ɵ0 = _assertFn;
/**
 * @param {?} enableAsserts
 * @return {?}
 */
function _makeAssertFn(enableAsserts) {
    if (enableAsserts) {
        return (condition, message) => {
            if (!condition) {
                // Create a new `Error`, which automatically gets `stack`
                const /** @type {?} */ err = new Error(message || 'Assertion failed');
                err.stack = (err.stack || {}).toString();
                err.stack = err.stack.split('\n').splice(2).join('\n');
                /* tslint:disable no-debugger */
                // jshint -W087
                debugger;
                /* tslint:enable no-debugger */
                throw err;
            }
        };
    }
    else {
        return () => {
            // noop
        };
    }
}
export { ɵ0 };
//# sourceMappingURL=assert.js.map