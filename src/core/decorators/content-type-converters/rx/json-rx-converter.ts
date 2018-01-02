import { ResponseContentTypeConverter } from './response-converter-store';
import { Headers } from '../../parameters.decorator';
import { ContentTypeConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';

export class JsonConverter implements ResponseContentTypeConverter<Object> {
  private static readonly SUPPORTED_CONTENT_TYPES = [ContentTypeConstants.JSON];
  convert(response: Response): Promise<Object> {
    if (!JsonConverter.accept(response)) {
      throw new SynapseError(`Expected content type to be "${ContentTypeConstants.JSON}". \
Got "${response.headers.get(Headers.CONTENT_TYPE)}"`);
    }

    return response.json();
  }

  static accept(response: Response): boolean {
    return !!JsonConverter.SUPPORTED_CONTENT_TYPES
      .filter(type => (response.headers.get(Headers.CONTENT_TYPE)).indexOf(type) === 0).length;
  }
}
