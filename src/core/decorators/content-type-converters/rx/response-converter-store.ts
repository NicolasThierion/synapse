import { SynapseError } from '../../../../utils/synapse-error';
import { ContentTypeConstants } from '../../../constants';
import { JsonConverter } from './json-rx-converter';
import { TextConverter } from './text-rx-converter';
import { BlobConverter } from './blob-rx-converter';

export interface ResponseContentTypeConverter<T> {
  convert(response: Response): Promise<T>;
}

export class ResponseContentTypeConverterStore {
  private static converters: {[key: string]: ResponseContentTypeConverter<any>} = {};

  static addConverter(converter: ResponseContentTypeConverter<any>, contentType: ContentTypeConstants | string) {
    this.converters[contentType] = converter;
  }

  static getConverterFor(contentType: ContentTypeConstants): ResponseContentTypeConverter<any> {
    let converter = this.converters[contentType];
    if (!converter) {
      console.warn(`no Content-Type converters found for response with Content-Type "${contentType}"`);
      converter = this.converters['default'];
    }

    return converter;
  }
}

ResponseContentTypeConverterStore.addConverter(new BlobConverter(), 'default');
ResponseContentTypeConverterStore.addConverter(new JsonConverter(), ContentTypeConstants.JSON);
ResponseContentTypeConverterStore.addConverter(new TextConverter(), ContentTypeConstants.PLAIN_TEXT);
