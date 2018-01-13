/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { cloneDeep, defaults } from 'lodash';
import { isUndefined } from 'util';
export class TypedResponse {
    /**
     * @param {?=} body
     * @param {?=} init
     */
    constructor(body, init = {}) {
        this.body = body;
        if (isUndefined((/** @type {?} */ (init)).url)) {
            const /** @type {?} */ i = /** @type {?} */ (init);
            defaults(this, new Response(undefined, i));
        }
        else {
            const /** @type {?} */ r = /** @type {?} */ (init);
            defaults(this, r);
        }
    }
    /**
     * @return {?}
     */
    clone() {
        return new TypedResponse(cloneDeep(/** @type {?} */ (this.body)), defaults({ body: undefined }, this));
    }
}
function TypedResponse_tsickle_Closure_declarations() {
    /** @type {?} */
    TypedResponse.prototype.body;
    /** @type {?} */
    TypedResponse.prototype.headers;
    /** @type {?} */
    TypedResponse.prototype.ok;
    /** @type {?} */
    TypedResponse.prototype.status;
    /** @type {?} */
    TypedResponse.prototype.statusText;
    /** @type {?} */
    TypedResponse.prototype.type;
    /** @type {?} */
    TypedResponse.prototype.url;
    /** @type {?} */
    TypedResponse.prototype.redirected;
}
//# sourceMappingURL=typed-response.model.js.map