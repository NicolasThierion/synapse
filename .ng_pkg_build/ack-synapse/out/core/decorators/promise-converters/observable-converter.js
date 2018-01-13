/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Observable } from 'rxjs/Observable';
export class ObservableConverter {
    /**
     * @template T
     * @param {?} promise
     * @return {?}
     */
    convert(promise) {
        return Observable.fromPromise(promise);
    }
    /**
     * @param {?} convertTo
     * @return {?}
     */
    accept(convertTo) {
        return convertTo instanceof Observable;
    }
}
//# sourceMappingURL=observable-converter.js.map