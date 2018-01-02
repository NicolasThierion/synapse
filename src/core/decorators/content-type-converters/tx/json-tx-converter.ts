import { RequestContentTypeConverter } from './request-converter-store';
import { ContentTypeConstants, HeaderConstants } from '../../../constants';
import { SynapseError } from '../../../../utils/synapse-error';
import { isObject, isArray, isString } from 'lodash';

export class JsonConverter implements RequestContentTypeConverter {
  private static readonly SUPPORTED_CONTENT_TYPES = [ContentTypeConstants.JSON];

  async convert(body: any, request: Request): Promise<Request> {
    if (!JsonConverter.accept(body)) {
      throw new SynapseError(`Expected body be Object | String | Array. \
Got "${typeof body}"`);
    }

    request.headers.set(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.JSON);

    return Promise.resolve(new Request(request, {
      body: JSON.stringify(body)
    }));
  }

  static accept(body: any): boolean {
    return isObject(body) || isArray(body) || isString(body);
  }
}
