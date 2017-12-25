import 'reflect-metadata';
import { SynapseApiConfig } from './synapse-api.decorator';
import { SynapseConf } from '../synapse-conf';
import { assert } from '../../utils/assert';
import * as _ from 'lodash';
import { StateError } from '../../utils/state-error';
import { Synapse } from '../core';

const DECORATED_PARAMETERS_KEY = 'HttpParamDecorator';
const CONF_KEY = 'SynapseApiConf';

export namespace SynapseApiReflect {

  export class DecoratedArgs {
    public readonly path: number[] = [];
    public readonly query: number[] = [];
    public readonly headers: number[] = [];
    public readonly body: number[] = [];
  }

  export interface SynapseApiClass {}

  export function init(classPrototype: SynapseApiClass, conf: SynapseApiConfig): void {
    assert(classPrototype);
    // inherits config from parent annotation
    conf = _inheritConf(classPrototype, _.cloneDeep(conf));

    // retrieve global config
    const globalConf = Synapse.getConfig();

    // patch it with local @SynapseApi config.
    const conf_: SynapseApiConfig & SynapseConf = _.cloneDeep(_.defaultsDeep(conf as SynapseApiConfig, globalConf));
    conf_.path = encodeURI(conf_.path);

    Object.freeze(conf_);
    assert(!Reflect.getOwnMetadata(CONF_KEY, classPrototype) ||
      _.isEqual(conf_, Reflect.getOwnMetadata(CONF_KEY, classPrototype) ));
    Reflect.defineMetadata(CONF_KEY, conf_, classPrototype);
  }

  export function getConf(classPrototype: SynapseApiClass): SynapseApiConfig & SynapseConf {
    assert(classPrototype);
    const res = Reflect.getOwnMetadata(CONF_KEY, classPrototype);
    if (!res) {
      throw new StateError(`no configuration found for class ${classPrototype}.
      Are you sure that this type is properly decorated with "@SynapseApi" ?`);
    }

    return _.cloneDeep(res);
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

function _inheritConf(classPrototype: SynapseApiReflect.SynapseApiClass,
                      conf: SynapseApiConfig): SynapseApiConfig {
  const parentCtor  = Object.getPrototypeOf(classPrototype).constructor;

  // if parent constructor is not 'Object'
  if (parentCtor.name !== 'Object') {
    const parentConf = Reflect.getOwnMetadata(CONF_KEY, parentCtor.prototype);
    conf = _.defaultsDeep({path: `${_sanitizePath(parentConf.path)}/${_sanitizePath(conf.path)}`}, conf, parentConf);
  }

  return conf;
}

function _sanitizePath(path: string): string {
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  return path;
}