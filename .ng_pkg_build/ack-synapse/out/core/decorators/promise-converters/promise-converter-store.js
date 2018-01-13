/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ObservableConverter } from './observable-converter';
import { PromiseConverterImpl } from './promise-converter';
import { isNull, isUndefined } from 'util';
/**
 * @record
 */
export function PromiseConverter() { }
function PromiseConverter_tsickle_Closure_declarations() {
    /** @type {?} */
    PromiseConverter.prototype.convert;
    /** @type {?} */
    PromiseConverter.prototype.accept;
}
export class PromiseConverterStore {
    /**
     * @param {?} converter
     * @return {?}
     */
    static addConverter(converter) {
        this.converters.push(converter);
    }
    /**
     * @param {?} convertTo
     * @return {?}
     */
    static getConverterFor(convertTo) {
        if (isNull(convertTo) || isUndefined(convertTo)) {
            return new PromiseConverterImpl();
        }
        return this.converters.filter(c => c.accept(convertTo))[0];
    }
}
PromiseConverterStore.converters = [];
function PromiseConverterStore_tsickle_Closure_declarations() {
    /** @type {?} */
    PromiseConverterStore.converters;
}
PromiseConverterStore.addConverter(new ObservableConverter());
PromiseConverterStore.addConverter(new PromiseConverterImpl());
//# sourceMappingURL=promise-converter-store.js.map