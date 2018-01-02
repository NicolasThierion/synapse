import { RequestContentTypeConverter } from './request-converter-store';
import { ContentTypeConstants, HeaderConstants } from '../../../constants';
import { isString } from 'lodash';


export class TextConverter implements RequestContentTypeConverter {
  private static readonly SUPPORTED_CONTENT_TYPES = [ContentTypeConstants.PLAIN_TEXT];

  async convert(body: any, request: Request): Promise<Request> {
    request.headers.set(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.PLAIN_TEXT);

    if (!isString(body)) {
      body = JSON.stringify(body);
    }
    return Promise.resolve(new Request(request, {
      body: body
    }));
  }
}
