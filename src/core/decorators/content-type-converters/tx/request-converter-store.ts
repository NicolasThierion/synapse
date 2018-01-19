import { SynapseError } from '../../../../utils';
import { ContentTypeConstants } from '../../../constants';
import { JsonConverter } from './json-tx-converter';
import { TextConverter } from './text-tx-converter';
import { UrlencodedTxConverter } from './urlencoded-tx-converter';

export interface RequestContentTypeConverter {
  convert(body: any, request: Request): Promise<Request>;
}

export class RequestConverterStore {
  private static converters: {[key: string]: RequestContentTypeConverter} = {};

  static addConverter(converter: RequestContentTypeConverter, contentType: ContentTypeConstants | string): void {
    this.converters[contentType] = converter;
  }

  static getConverterFor(contentType: ContentTypeConstants): RequestContentTypeConverter {
    const converter = this.converters[contentType];
    if (!converter) {
      throw new SynapseError(`no Content-Type converters found for @Body with Content-Type "${contentType}"`);
    }

    return converter;
  }
}

RequestConverterStore.addConverter(new JsonConverter(), ContentTypeConstants.JSON);
RequestConverterStore.addConverter(new TextConverter(), ContentTypeConstants.PLAIN_TEXT);
RequestConverterStore.addConverter(new UrlencodedTxConverter(), ContentTypeConstants.X_WWW_URL_ENCODED);
