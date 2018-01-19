import { assign, defaults, isString } from 'lodash';
import { ContentTypeConstants, HeaderConstants } from '../constants';
import { MapperType } from '../mapper.type';
import { SynapseApiReflect } from './synapse-api.reflect';

// TODO support pathParam mapping
/**
 * Use this decorator on a parameter to specify that it should be considered as a path parameter.
 * The mapped parameter should be either a string, a number or a boolean. Any other type will throw an error.
 */
export function PathParam(): ParameterDecorator {
  return SynapseApiReflect.addPathParamArg();
}

// TODO support queryParam mapping
/**
 * Use this decorator on a parameter to specify that it should be considered as a query parameter.
 */
export function QueryParams(): ParameterDecorator {
  return SynapseApiReflect.addQueryParamsArg();
}

// TODO add support for merge=true.

/**
 * Use this decorator on a parameter to specify that it should be considered as a header.
 * The given headers will be merged with any specified global header.
 * If you use multiple {@code Headers} decorators for a method, header will be merged as well.
 */
export const Headers = assign((): ParameterDecorator  => {
  return SynapseApiReflect.addHeadersArg();
}, HeaderConstants);

/**
 * Use this decorator on a parameter to specify that it should be considered as a body. Can be used once at most per method.
 */
export const Body = assign((params: BodyParams | ContentTypeConstants = ContentTypeConstants.JSON): ParameterDecorator => {
  const params_: BodyParams = defaults(isString(params) ? {
    contentType: params as ContentTypeConstants
  } : params as BodyParams, {
    contentType: ContentTypeConstants.JSON
  });

  return SynapseApiReflect.addBodyArg(params_);
}, {
  ContentType: ContentTypeConstants
});

export interface BodyParams {
  contentType?: ContentTypeConstants;
  mapper?: MapperType<Object, any>;
}
