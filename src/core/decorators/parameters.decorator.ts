import { SynapseApiReflect } from './synapse-api.reflect';

// TODO support pathParam mapping
/**
 * Use this decorator on a parameter to specify that it should be considered as a path parameter.
 * The mapped parameter should be either a string, a number or a boolean. Any other type will throw an error.
 *
 * @returns {ParameterDecorator}
 * @constructor
 */
export function PathParam(): ParameterDecorator {
  return _parameterDecorator(SynapseApiReflect.addPathParamArg);
}

// TODO support queryParam mapping
/**
 * Use this decorator on a parameter to specify that it should be considered as a query parameter.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function QueryParams(): ParameterDecorator {
  return _parameterDecorator(SynapseApiReflect.addQueryParamsArg);
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
  return _parameterDecorator(SynapseApiReflect.addHeadersArg);
}

// TODO let choice between 'form-data', 'x-www-form-urlencoded', 'raw' or 'binary'
/**
 * Use this decorator on a parameter to specify that it should be considered as a body. Can be used once at most per method.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function Body(): ParameterDecorator {
  return _parameterDecorator(SynapseApiReflect.addBodyArg);
}

function _parameterDecorator(fn: Function): ParameterDecorator {
  return function HttpParamDecorator(target: Object,
                                     propertyKey: string | symbol,
                                     index: number): void {

    fn(target, propertyKey, index);
  };
}
