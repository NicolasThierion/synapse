/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ContentTypeConstants, HeaderConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';
import { isArray, isObject } from 'lodash';
import { toQueryString } from '../../../../utils/utils';
export class UrlencodedTxConverter {
    /**
     * @param {?} body
     * @param {?} request
     * @return {?}
     */
    convert(body, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!UrlencodedTxConverter.accept(body)) {
                throw new SynapseError(`Expected body be Object | Array. \
Got "${typeof body}"`);
            }
            request.headers.set(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.X_WWW_URL_ENCODED);
            return Promise.resolve(new Request(request, {
                body: new URLSearchParams(toQueryString(body)).toString()
            }));
        });
    }
    /**
     * @param {?} body
     * @return {?}
     */
    static accept(body) {
        return isObject(body) || isArray(body);
    }
}
//# sourceMappingURL=urlencoded-tx-converter.js.map