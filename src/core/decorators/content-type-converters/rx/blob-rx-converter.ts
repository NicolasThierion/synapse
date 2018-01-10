import { ResponseContentTypeConverter } from './response-converter-store';
import { Headers } from '../../parameters.decorator';
import { ContentTypeConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';

export class BlobConverter implements ResponseContentTypeConverter<Object> {
  convert(response: Response): Promise<Object> {
    return response.blob();
  }
}
