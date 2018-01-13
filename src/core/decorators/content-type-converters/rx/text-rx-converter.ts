import { ResponseContentTypeConverter } from './response-converter-store';
import { Headers } from '../../parameters.decorator';
import { ContentTypeConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';

// @dynamic // https://github.com/angular/angular/issues/19698#issuecomment-338340211
export class TextConverter implements ResponseContentTypeConverter<string> {
  private static readonly SUPPORTED_CONTENT_TYPES = [ContentTypeConstants.JSON, ContentTypeConstants.PLAIN_TEXT];
  convert(response: Response): Promise<string> {
    if (!TextConverter.accept(response)) {
      throw new SynapseError(`Expected content type to be ${TextConverter.SUPPORTED_CONTENT_TYPES}.
Got ${response.headers.get(Headers.CONTENT_TYPE)}`);
    }

    return response.text();
  }

  static accept(response: Response): boolean {
    return !!TextConverter.SUPPORTED_CONTENT_TYPES
      .filter(type => (response.headers.get(Headers.CONTENT_TYPE)).indexOf(type) === 0).length;
  }
}
