import { SynapseApiReflect } from './synapse-api.reflect';

export interface PathParameterName {
  param: string | number;
}

export function PathParam(): ParameterDecorator {
  return _parameterDecorator(SynapseApiReflect.addPathParamArg);
}

export function QueryParams(): ParameterDecorator {
  return _parameterDecorator(SynapseApiReflect.addQueryParamsArg);
}

export function Headers(): ParameterDecorator {
  return _parameterDecorator(SynapseApiReflect.addHeadersArg);
}

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
