import { SynapseApiReflect } from './synapse-api.reflect';
import { MapperType } from '../mapper.type';
import { ContentType } from '../core';
import * as _ from 'lodash';

// TODO support pathParam mapping
/**
 * Use this decorator on a parameter to specify that it should be considered as a path parameter.
 * The mapped parameter should be either a string, a number or a boolean. Any other type will throw an error.
 *
 * @returns {ParameterDecorator}
 * @constructor
 */
export function PathParam(): ParameterDecorator {
  return SynapseApiReflect.addPathParamArg();
}

// TODO support queryParam mapping
/**
 * Use this decorator on a parameter to specify that it should be considered as a query parameter.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function QueryParams(): ParameterDecorator {
  return SynapseApiReflect.addQueryParamsArg();
}

// TODO add support for merge=true.
/**
 * Use this decorator on a parameter to specify that it should be considered as a header.
 * The given headers will be merged with any specified global header.
 * If you use multiple {@code Headers} decorators for a method, header will be merged as well.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function Headers(): ParameterDecorator {
  return SynapseApiReflect.addHeadersArg();
}

/**
 * Use this decorator on a parameter to specify that it should be considered as a body. Can be used once at most per method.
 * @returns {ParameterDecorator}
 * @constructor
 */
// TODO support for mappers
// TODO let choice between 'form-data', 'x-www-form-urlencoded', 'raw' or 'binary'
export function Body(params: BodyParams | ContentType = ContentType.FORM_DATA): ParameterDecorator {
  const params_: BodyParams = _.defaults(_.isString(params) ? {
    contentType: params as ContentType
  } : params as BodyParams, {
    contentType: ContentType.FORM_DATA
  });

  return SynapseApiReflect.addBodyArg(params_);
}

export interface BodyParams {
  contentType?: ContentType;
  mapper?: MapperType<Object, any>;
}
