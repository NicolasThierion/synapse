/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { SynapseError } from '../../../../utils/synapse-error';
import { ContentTypeConstants } from '../../../constants';
import { JsonConverter } from './json-tx-converter';
import { TextConverter } from './text-tx-converter';
import { UrlencodedTxConverter } from './urlencoded-tx-converter';
/**
 * @record
 */
export function RequestContentTypeConverter() { }
function RequestContentTypeConverter_tsickle_Closure_declarations() {
    /** @type {?} */
    RequestContentTypeConverter.prototype.convert;
}
export class RequestConverterStore {
    /**
     * @param {?} converter
     * @param {?} contentType
     * @return {?}
     */
    static addConverter(converter, contentType) {
        this.converters[contentType] = converter;
    }
    /**
     * @param {?} contentType
     * @return {?}
     */
    static getConverterFor(contentType) {
        const /** @type {?} */ converter = this.converters[contentType];
        if (!converter) {
            throw new SynapseError(`no Content-Type converters found for @Body with Content-Type "${contentType}"`);
        }
        return converter;
    }
}
RequestConverterStore.converters = {};
function RequestConverterStore_tsickle_Closure_declarations() {
    /** @type {?} */
    RequestConverterStore.converters;
}
RequestConverterStore.addConverter(new JsonConverter(), ContentTypeConstants.JSON);
RequestConverterStore.addConverter(new TextConverter(), ContentTypeConstants.PLAIN_TEXT);
RequestConverterStore.addConverter(new UrlencodedTxConverter(), ContentTypeConstants.X_WWW_URL_ENCODED);
//# sourceMappingURL=request-converter-store.js.map