/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Headers } from '../../parameters.decorator';
import { ContentTypeConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';
export class JsonConverter {
    /**
     * @param {?} response
     * @return {?}
     */
    convert(response) {
        if (!JsonConverter.accept(response)) {
            throw new SynapseError(`Expected content type to be "${ContentTypeConstants.JSON}". \
Got "${response.headers.get(Headers.CONTENT_TYPE)}"`);
        }
        return response.json();
    }
    /**
     * @param {?} response
     * @return {?}
     */
    static accept(response) {
        return !!JsonConverter.SUPPORTED_CONTENT_TYPES
            .filter(type => (response.headers.get(Headers.CONTENT_TYPE)).indexOf(type) === 0).length;
    }
}
JsonConverter.SUPPORTED_CONTENT_TYPES = [ContentTypeConstants.JSON];
function JsonConverter_tsickle_Closure_declarations() {
    /** @type {?} */
    JsonConverter.SUPPORTED_CONTENT_TYPES;
}
//# sourceMappingURL=json-rx-converter.js.map