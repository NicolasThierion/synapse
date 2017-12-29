import 'reflect-metadata';
import { SynapseApiConfig } from './synapse-api.decorator';
import { SynapseConf } from '../synapse-conf';
import { assert } from '../../utils/assert';
import * as _ from 'lodash';
import { StateError } from '../../utils/state-error';
import { Synapse } from '../core';
import { joinPath, removeTrailingSlash } from '../../utils/utils';
import { BodyParams } from './parameters.decorator';

const DECORATED_PARAMETERS_KEY = 'HttpParamDecorator';
const CONF_KEY = 'SynapseApiConf';

export namespace SynapseApiReflect {

  export class DecoratedArgs {
    public readonly path: number[] = [];
    public readonly query: number[] = [];
    public readonly headers: number[] = [];
    public body: {
      index: number,
      params: BodyParams
    };
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
    Object.freeze(conf_);

    // save conf for this class.
    Reflect.defineMetadata(CONF_KEY, conf_, classPrototype);
  }

  export function getConf(classPrototype: SynapseApiClass): SynapseApiConfig & SynapseConf {
    assert(classPrototype);
    if (!hasConf(classPrototype)) {
      throw new StateError(`no configuration found for class ${classPrototype.constructor.name}.
      Are you sure that this type is properly decorated with "@SynapseApi" ?`);
    }

    return _.cloneDeep(Reflect.getOwnMetadata(CONF_KEY, classPrototype));
  }

  export function hasConf(classPrototype: SynapseApiClass): boolean {
    assert(classPrototype);
    return !!Reflect.getOwnMetadata(CONF_KEY, classPrototype);
  }

  export function addPathParamArg(): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      const decoratedArgs = getDecoratedArgs(target, key);
      decoratedArgs.path.push(parameterIndex as number);

      // decorators seems to process argument not always in natural order.
      decoratedArgs.path.sort();
    };
  }

  export function addQueryParamsArg(): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      getDecoratedArgs(target, key).query.push(parameterIndex);
    };
  }

  export function addHeadersArg(): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      getDecoratedArgs(target, key).headers.push(parameterIndex);
    };
  }

  export function addBodyArg(params: BodyParams): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      const args = getDecoratedArgs(target, key);
      if (args.body) {
        throw new TypeError('Can specify only one @Body parameter per method.');
      }

      getDecoratedArgs(target, key).body = {
        index: parameterIndex,
        params
      };
    };
  }

  export function getDecoratedArgs(target: Object, key: string | symbol): DecoratedArgs {
    let args: DecoratedArgs = Reflect.getOwnMetadata(DECORATED_PARAMETERS_KEY, target, key);
    if (!args) {
      args = new DecoratedArgs();
      Reflect.defineMetadata(DECORATED_PARAMETERS_KEY, args , target, key);
    }

    return args;
  }

  export function addHandler(): void {
    // TODO
    throw new Error('not implemented');
  }
}

function _inheritConf(classPrototype: SynapseApiReflect.SynapseApiClass,
                      conf: SynapseApiConfig): SynapseApiConfig {
  const parentCtor  = Object.getPrototypeOf(classPrototype).constructor;

  // if parent constructor is not 'Object'
  if (parentCtor.name !== 'Object') {

    const parentConf = Reflect.getOwnMetadata(CONF_KEY, parentCtor.prototype);
    const path = (conf.path && conf.path !== '') ? conf.path : parentConf.path;
    conf = _.defaultsDeep({path}, conf, parentConf);
  }

  return conf;
}
