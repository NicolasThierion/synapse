import {
  isFunction,
  isNumber
} from 'lodash';
import 'reflect-metadata';
import { assert, mergeConfigs, StateError, SynapseError } from '../../utils';
import { SynapseApiConfig } from '../api-config.type';
import { SynapseConfig } from '../config.type';
import { SynapseApiClass } from '../synapse-api.type';
import { SynapseMethod } from '../synapse-method.type';
import { BodyParams } from './parameters.decorator';

const DECORATED_PARAMETERS_KEY = 'HttpParamDecorator';
const CONF_KEY = 'SynapseApiConfig';
const ORIGINAL_PROTO = 'origProto';
// keep track of metadata for further cleanup
const CLASS_METADATA_REGISTRY = [];

export namespace SynapseApiReflect {

  export let Synapse;

  export class DecoratedArgs {
    readonly path: {index: number}[] = [];
    readonly query: {index: number}[] = [];
    readonly headers: {index: number}[] = [];
    body: {
      index: number,
      params: BodyParams
    };
  }

  export function init(classPrototype: SynapseApiClass, conf: SynapseApiConfig): SynapseConfig & SynapseApiConfig {
    assert(classPrototype);
    // inherits config from parent annotation
    conf = _inheritConf(classPrototype, conf);

    // retrieve global config
    const globalConf = Synapse.getConfig();

    // patch it with local @SynapseApi config.
    const conf_: any = mergeConfigs({}, conf as SynapseApiConfig, globalConf, {
      path: ''
    } as any);
    Object.freeze(conf_);
    CLASS_METADATA_REGISTRY.push(classPrototype);
    // save conf for this class.
    Reflect.defineMetadata(CONF_KEY, conf_, classPrototype);

    // store proto twice, as classPrototype will we enhanced to inject apiConfig within methods
    // but we still need orig proto for child classes.
    const oldProto = _flatProto(classPrototype);
    _patchProto(classPrototype);

    Reflect.defineMetadata(ORIGINAL_PROTO, oldProto, classPrototype);

    return conf_;
  }

  export function getConf(classPrototype: SynapseApiClass): SynapseApiConfig & SynapseConfig {
    assert(classPrototype);
    if (!hasConf(classPrototype)) {
      throw new StateError(`no configuration found for class ${classPrototype.constructor.name}.
      Are you sure that this type is properly decorated with "@SynapseApi" ?`);
    }

    return Reflect.getOwnMetadata(CONF_KEY, classPrototype);
  }

  export function hasConf(classPrototype: SynapseApiClass): boolean {
    assert(classPrototype);

    return !!Reflect.getOwnMetadata(CONF_KEY, classPrototype);
  }

  export function addPathParamArg(): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      _assertDecorateParameter('@PathParams', key, parameterIndex);
      const decoratedArgs = getDecoratedArgs(target, key);
      decoratedArgs.path.push({index: parameterIndex});

      // decorators seems to process argument not always in natural order.
      decoratedArgs.path.sort((a, b) => a.index - b.index);
    };
  }

  export function addQueryParamsArg(): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      _assertDecorateParameter('@QueryParams', key, parameterIndex);
      getDecoratedArgs(target, key).query.push({index: parameterIndex});
    };
  }

  export function addHeadersArg(): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      _assertDecorateParameter('@Headers', key, parameterIndex);
      getDecoratedArgs(target, key).headers.push({index: parameterIndex});
    };
  }

  export function addBodyArg(params: BodyParams): ParameterDecorator {
    return (target: Object, key: string | symbol, parameterIndex: number) => {
      const args = getDecoratedArgs(target, key);
      if (args.body) {
        throw new TypeError('Can specify only one @Body parameter per method.');
      }

      args.body = {
        index: parameterIndex,
        params
      };
    };
  }

  export function getDecoratedArgs(target: Object, key: string | symbol): DecoratedArgs {
    let args: DecoratedArgs = Reflect.getOwnMetadata(DECORATED_PARAMETERS_KEY, target, key);
    if (!args) {
      args = new DecoratedArgs();
      Reflect.defineMetadata(DECORATED_PARAMETERS_KEY, args, target, key);
    }

    return args;
  }

  export function teardown(): void {
    CLASS_METADATA_REGISTRY.forEach(i => {
      Reflect.deleteMetadata(CONF_KEY, i);
    });
  }
}

function _inheritConf(classPrototype: SynapseApiClass,
                      conf: SynapseApiConfig): SynapseApiConfig {
  const parentCtor = Object.getPrototypeOf(classPrototype).constructor;

  // if parent constructor is not 'Object'
  if (parentCtor.name !== 'Object') {

    const parentConf = Reflect.getOwnMetadata(CONF_KEY, parentCtor.prototype);
    const path = (conf.path && conf.path !== '') ? conf.path : parentConf.path;
    conf = mergeConfigs({path}, conf, parentConf);
  }

  return conf;
}

function _assertDecorateParameter(decorator: string, key: string | symbol, parameterIndex: number): void {
  if (!isNumber(parameterIndex)) {
    throw new SynapseError(`${decorator} should decorate parameters only. (Found @${decorator} on function ${key}})`);
  }
}

function _patchProto(classPrototype: SynapseApiClass): void {
  // patch annotated methods by injecting current target (and its conf)
  const flatProto = _flatProto(classPrototype);   // patch methods from all parents too.
  Object.keys(flatProto)
  // only want functions
    .filter(p => p !== 'constructor')
    .filter(p => isFunction(classPrototype[p]))
    // only want decorated methods that needs patch
    .filter(p => !!Object.getOwnPropertyDescriptor((classPrototype[p] as SynapseMethod), 'synapseConfig'))
    .forEach(p => {
      // as per synapseENdpointDecorator, functions are defined as a lazy-init function, that needs to be init with target.
      classPrototype[p] = flatProto[p](classPrototype);
    });
}

function _flatProto(proto: Object): Object {
  const flat = {};
  while (proto) {
    proto = Reflect.getOwnMetadata(ORIGINAL_PROTO, proto) || proto;
    Object.getOwnPropertyNames(proto)
      .filter(p => p !== 'constructor')
      .forEach(p => {
        flat[p] = flat[p] === undefined ? proto[p] : flat[p];
      });

    const parentProto = Object.getPrototypeOf(proto);
    proto = parentProto.constructor !== Object ? parentProto : null;
  }

  return flat;
}
