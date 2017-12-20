import 'reflect-metadata';
import { RestApiConfig } from './rest-api.decorator';
import { SynapseConf } from '../synapse-conf';
import { assert } from '../../utils/assert';

const DECORATED_PARAMETERS_KEY = 'HttpParamDecorator';
const CONF_KEY = 'RestApiConf';

export namespace RestApiReflect {

  export class DecoratedArgs {
    public readonly path: number[] = [];
    public readonly query: number[] = [];
    public readonly headers: number[] = [];
    public readonly body: number[] = [];
  }

  export interface RestApiClass {}

  export function init(clazz: RestApiClass, conf: RestApiConfig & SynapseConf): void {
    assert(clazz);
    Reflect.defineMetadata(CONF_KEY, conf, clazz);
  }

  export function getConf(clazz: RestApiClass): RestApiConfig & SynapseConf {
    assert(clazz);
    return Reflect.getOwnMetadata(CONF_KEY, clazz);
  }

  export const addPathParamArg: ParameterDecorator = (target: Object, key: string | symbol, parameterIndex: number) => {
    getDecoratedArgs(target, key).path.push(parameterIndex as any);
  };

  export const addQueryParamsArg: ParameterDecorator = (target: Object, key: string | symbol, parameterIndex: number) => {
    getDecoratedArgs(target, key).query.push(parameterIndex);
  };

  export const addHeadersArg: ParameterDecorator = (target: Object, key: string | symbol, parameterIndex: number) => {
    getDecoratedArgs(target, key).headers.push(parameterIndex);
  };

  export const addBodyArg: ParameterDecorator = (target: Object, key: string | symbol, parameterIndex: number) => {
    const args = getDecoratedArgs(target, key);
    if (args.body.length === 1) {
      throw new TypeError('Can specify only one @Body parameter per method.');
    }

    getDecoratedArgs(target, key).body.push(parameterIndex);
  };

  export function getDecoratedArgs(target: Object, key: string | symbol): DecoratedArgs {
    let args: DecoratedArgs = Reflect.getOwnMetadata(DECORATED_PARAMETERS_KEY, target, key);
    if (!args) {
      args = new DecoratedArgs();
      Reflect.defineMetadata(DECORATED_PARAMETERS_KEY, args , target, key);
    }

    return args;
  }
}
