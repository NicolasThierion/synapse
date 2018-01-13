/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ContentTypeConstants, HeaderConstants } from '../../../constants';
import { isString } from 'lodash';
export class TextConverter {
    /**
     * @param {?} body
     * @param {?} request
     * @return {?}
     */
    convert(body, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            request.headers.set(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.PLAIN_TEXT);
            if (!isString(body)) {
                body = JSON.stringify(body);
            }
            return Promise.resolve(new Request(request, {
                body
            }));
        });
    }
}
//# sourceMappingURL=text-tx-converter.js.map