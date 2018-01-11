import { ResponseContentTypeConverter } from './response-converter-store';

export class BlobConverter implements ResponseContentTypeConverter<Object> {
  convert(response: Response): Promise<Object> {
    return response.blob();
  }
}
