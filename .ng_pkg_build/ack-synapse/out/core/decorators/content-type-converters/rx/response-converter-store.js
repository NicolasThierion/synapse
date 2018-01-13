/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ContentTypeConstants } from '../../../constants';
import { JsonConverter } from './json-rx-converter';
import { TextConverter } from './text-rx-converter';
import { BlobConverter } from './blob-rx-converter';
/**
 * @record
 */
export function ResponseContentTypeConverter() { }
function ResponseContentTypeConverter_tsickle_Closure_declarations() {
    /** @type {?} */
    ResponseContentTypeConverter.prototype.convert;
}
export class ResponseContentTypeConverterStore {
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
        let /** @type {?} */ converter = this.converters[contentType];
        if (!converter) {
            console.warn(`no Content-Type converters found for response with Content-Type "${contentType}"`);
            converter = this.converters['default'];
        }
        return converter;
    }
}
ResponseContentTypeConverterStore.converters = {};
function ResponseContentTypeConverterStore_tsickle_Closure_declarations() {
    /** @type {?} */
    ResponseContentTypeConverterStore.converters;
}
ResponseContentTypeConverterStore.addConverter(new BlobConverter(), 'default');
ResponseContentTypeConverterStore.addConverter(new JsonConverter(), ContentTypeConstants.JSON);
ResponseContentTypeConverterStore.addConverter(new TextConverter(), ContentTypeConstants.PLAIN_TEXT);
//# sourceMappingURL=response-converter-store.js.map