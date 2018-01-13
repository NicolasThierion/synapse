/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ContentTypeConstants, HeaderConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';
import { isArray, isObject, isString } from 'lodash';
export class JsonConverter {
    /**
     * @param {?} body
     * @param {?} request
     * @return {?}
     */
    convert(body, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!JsonConverter.accept(body)) {
                throw new SynapseError(`Expected body be Object | String | Array. \
Got "${typeof body}"`);
            }
            request.headers.set(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.JSON);
            return Promise.resolve(new Request(request, {
                body: JSON.stringify(body)
            }));
        });
    }
    /**
     * @param {?} body
     * @return {?}
     */
    static accept(body) {
        return isObject(body) || isArray(body) || isString(body);
    }
}
//# sourceMappingURL=json-tx-converter.js.map