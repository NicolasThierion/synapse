import { RequestContentTypeConverter } from './request-converter-store';
import { ContentTypeConstants, HeaderConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';
import { isObject, isArray, isString } from 'lodash';
import { toQueryString } from '../../../../utils/utils';

export class UrlencodedTxConverter implements RequestContentTypeConverter {
  private static readonly SUPPORTED_CONTENT_TYPES = [ContentTypeConstants.JSON];

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
