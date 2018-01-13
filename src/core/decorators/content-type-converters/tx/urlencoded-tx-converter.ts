import { isArray, isObject } from 'lodash';
import { toQueryString, SynapseError } from '../../../../utils';
import { RequestContentTypeConverter } from './request-converter-store';
import { ContentTypeConstants, HeaderConstants } from '../../../constants';

export class UrlencodedTxConverter implements RequestContentTypeConverter {
  async convert(body: any, request: Request): Promise<Request> {
    if (!UrlencodedTxConverter.accept(body)) {
      throw new SynapseError(`Expected body be Object | Array. \
Got "${typeof body}"`);
    }

    request.headers.set(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.X_WWW_URL_ENCODED);

    return Promise.resolve(new Request(request, {
      body: new URLSearchParams(toQueryString(body)).toString()
    }));
  }

  static accept(body: any): boolean {
    return isObject(body) || isArray(body);
  }
}
