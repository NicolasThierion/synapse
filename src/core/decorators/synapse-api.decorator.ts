import * as _ from 'lodash';
import { HttpBackendAdapter } from '../http-backend.interface';
import { SynapseApiReflect } from './synapse-api.reflect';

export interface SynapseApiConfig {
  path?: string;
  baseUrl?: string;
  httpBackend?: HttpBackendAdapter;
  headers?: Object;
  // TODO support for mappers
  // TODO support for handler
}

/**
 * Use this decorator on your web API class.
 *
 * You can specify an optional resource path to this API, or a complete {@link SynapseApiConfig},
 * that will applies to this class and all of its sub classes.
 *
 * @param {string | SynapseApiConfig} conf
 * @returns {ClassDecorator}
 * @constructor
 */
export function SynapseApi(conf: string | SynapseApiConfig = ''): ClassDecorator {
  conf = _.cloneDeep(conf);

  return (ctor: any) => {

    // decorate constructor to add config within reflect metadata
    let newCtor = function(...args: any[]): SynapseApiReflect.SynapseApiClass {

      // call decoree constructor
      const res = ctor.apply(this, args);

      // store conf within metadata.
      // !!! It is important to call constructor before, to register config of any parent class decorated with @SynapseApi
      SynapseApiReflect.init(ctor.prototype, _.isString(conf) ? {path: conf as string} : conf as SynapseApiConfig);

      return res;
    };

    newCtor = renameFn(newCtor, ctor.prototype.constructor.name);
    newCtor.prototype = ctor.prototype;

    return newCtor as any;
  };

  function renameFn(fn, name) {
    return new Function('fn', `return function ${name}() {\n return fn.apply(this, arguments);\n}`)(fn);
   }
}

