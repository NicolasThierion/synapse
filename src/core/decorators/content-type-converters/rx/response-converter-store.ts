import { SynapseError } from '../../../../utils/synapse-error';
import { ContentTypeConstants } from '../../../constants';
import { JsonConverter } from './json-rx-converter';
import { TextConverter } from './text-rx-converter';

export interface ResponseContentTypeConverter<T> {
  convert(response: Response): Promise<T>;
}

export class ResponseContentTypeConverterStore {
  private static converters: {[key: string]: ResponseContentTypeConverter<any>} = {};

  static addConverter(converter: ResponseContentTypeConverter<any>, contentType: ContentTypeConstants | string) {
    this.converters[contentType] = converter;
  }

  static getConverterFor(contentType: ContentTypeConstants): ResponseContentTypeConverter<any> {
    const converter = this.converters[contentType];
    if (!converter) {
      throw new SynapseError(`no Content-Type converters found for response with Content-Type "${contentType}"`);
    }

    return converter;
  }
}

ResponseContentTypeConverterStore.addConverter(new JsonConverter(), ContentTypeConstants.JSON);
ResponseContentTypeConverterStore.addConverter(new TextConverter(), ContentTypeConstants.PLAIN_TEXT);
