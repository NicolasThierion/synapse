import { SynapseApiReflect } from './synapse-api.reflect';
import { cloneDeep, isFunction, isString } from 'lodash';
import { SynapseApiConfig } from '../api-config.type';
import { Constructor } from '../../utils/utils';
import SynapseApiClass = SynapseApiReflect.SynapseApiClass;

/**
 * Use this decorator on your web API class.
 *
 * You can specify an optional resource path to this API, or a complete {@link SynapseApiConfig},
 * that will applies to this class and all of its sub classes.
 *
 * @param confOrCtor
 * @returns
 */
export function SynapseApi(confOrCtor: string | SynapseApiConfig | Constructor<SynapseApiClass> = ''): ClassDecorator | any {
  // if called SynapseApi(...???...)
  if (!isFunction(confOrCtor)) {
    return (ctor: Constructor<SynapseApiClass>) => {
      if (!ctor) { throw new Error('assertion error'); }
      confOrCtor = isString(confOrCtor) ? {path: confOrCtor as string} : cloneDeep(confOrCtor) as SynapseApiConfig;

      return _makeNewCtor(ctor, confOrCtor);
    };
  } else {
    // if called SynapseApi
    return _makeNewCtor(confOrCtor as Constructor<SynapseApiClass>, {path: ''});
  }

  function _makeNewCtor(ctor: Constructor<SynapseApiClass>, conf: SynapseApiConfig): Constructor<SynapseApiClass> {

    // decorate constructor to add config within reflect metadata
    let newCtor: Constructor<SynapseApiClass> = function(...args: any[]): SynapseApiClass {

      // call decoree constructor
      const res = ctor.apply(this as any, args); // tslint:disable-line

      // store conf within metadata.
      // !!! It is important to call constructor before, to register config of any parent class decorated with @SynapseApi
      SynapseApiReflect.init(ctor.prototype, conf);

      return res;
    } as any;

    newCtor = renameFn(newCtor, ctor.prototype.constructor.name);
    newCtor.prototype = ctor.prototype;

    // copy static values
    Object.keys(ctor).forEach(k => newCtor[k] = ctor[k]);

    return newCtor;
  }

  function renameFn<T extends Function>(fn: T, name: string): T {
    return new Function('fn', `return function ${name}() {\n return fn.apply(this, arguments);\n}`)(fn) as T;
  }
}
