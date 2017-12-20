import { RestApiReflect } from './rest-api.reflect';

export interface PathParameterName {
  param: string | number;
}

export function PathParam(): ParameterDecorator {
  return _parameterDecorator(RestApiReflect.addPathParamArg);
}

export function QueryParams(): ParameterDecorator {
  return _parameterDecorator(RestApiReflect.addQueryParamsArg);
}

export function Headers(): ParameterDecorator {
  return _parameterDecorator(RestApiReflect.addHeadersArg);
}

export function Body(): ParameterDecorator {
  return _parameterDecorator(RestApiReflect.addBodyArg);
}

function _parameterDecorator(fn: Function): ParameterDecorator {
  return function HttpParamDecorator(target: Object,
                                     propertyKey: string | symbol,
                                     index: number): void {
    fn(target, propertyKey, index);
  };
}
