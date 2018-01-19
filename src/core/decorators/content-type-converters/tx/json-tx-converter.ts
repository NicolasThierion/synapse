import { isArray, isObject, isString } from 'lodash';
import { SynapseError } from '../../../../utils';
import { ContentTypeConstants, HeaderConstants } from '../../../constants';
import { RequestContentTypeConverter } from './request-converter-store';

export class JsonConverter implements RequestContentTypeConverter {
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
