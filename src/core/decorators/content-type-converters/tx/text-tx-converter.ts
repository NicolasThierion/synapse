import { isString } from 'lodash';
import { RequestContentTypeConverter } from './request-converter-store';
import { ContentTypeConstants, HeaderConstants } from '../../../constants';

export class TextConverter implements RequestContentTypeConverter {
  async convert(body: any, request: Request): Promise<Request> {
    request.headers.set(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.PLAIN_TEXT);

    if (!isString(body)) {
      body = JSON.stringify(body);
    }

    return Promise.resolve(new Request(request, {
      body
    }));
  }
}
