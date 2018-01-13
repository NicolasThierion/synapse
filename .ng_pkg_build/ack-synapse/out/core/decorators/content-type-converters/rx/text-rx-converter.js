/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Headers } from '../../parameters.decorator';
import { ContentTypeConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';
export class TextConverter {
    /**
     * @param {?} response
     * @return {?}
     */
    convert(response) {
        if (!TextConverter.accept(response)) {
            throw new SynapseError(`Expected content type to be ${TextConverter.SUPPORTED_CONTENT_TYPES}.
Got ${response.headers.get(Headers.CONTENT_TYPE)}`);
        }
        return response.text();
    }
    /**
     * @param {?} response
     * @return {?}
     */
    static accept(response) {
        return !!TextConverter.SUPPORTED_CONTENT_TYPES
            .filter(type => (response.headers.get(Headers.CONTENT_TYPE)).indexOf(type) === 0).length;
    }
}
TextConverter.SUPPORTED_CONTENT_TYPES = [ContentTypeConstants.JSON, ContentTypeConstants.PLAIN_TEXT];
function TextConverter_tsickle_Closure_declarations() {
    /** @type {?} */
    TextConverter.SUPPORTED_CONTENT_TYPES;
}
//# sourceMappingURL=text-rx-converter.js.map