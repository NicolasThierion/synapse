import { HttpBackendAdapter } from '../http-backend.interface';
import { SynapseApiReflect } from './synapse-api.reflect';
import { HttpRequestHandler, HttpResponseHandler } from '../core';
import {
  isFunction,
  isString,
  cloneDeep
} from 'lodash';


export interface SynapseApiConfig {
  path?: string;
  baseUrl?: string;
  httpBackend?: HttpBackendAdapter;
  headers?: Object;
  requestHandlers?: HttpRequestHandler[];
  responseHandlers?: HttpResponseHandler[];
}

/**
 * Use this decorator on your web API class.
 *
 * You can specify an optional resource path to this API, or a complete {@link SynapseApiConfig},
 * that will applies to this class and all of its sub classes.
 *
 * @param {string | SynapseApiConfig} confOrCtor
 * @returns {ClassDecorator}
 * @constructor
 */
export function SynapseApi(confOrCtor: string | SynapseApiConfig | Function = '' ): ClassDecorator | any {
  // if called SynapseApi(...???...)
  if (!isFunction(confOrCtor)) {
    return (ctor: any) => {
      if (!ctor) { throw new Error('assertion error'); }
      confOrCtor = isString(confOrCtor) ? {path: confOrCtor as string} : cloneDeep(confOrCtor) as SynapseApiConfig;
      return _makeNewCtor(ctor, confOrCtor);
    };
  } else {
    // if called SynapseApi
    return _makeNewCtor(confOrCtor as Function, {path: ''});
  }

  function _makeNewCtor(ctor: Function, conf: SynapseApiConfig) {

    // decorate constructor to add config within reflect metadata
    let newCtor = function(...args: any[]): SynapseApiReflect.SynapseApiClass {

      // call decoree constructor
      const res = ctor.apply(this, args);

      // store conf within metadata.
      // !!! It is important to call constructor before, to register config of any parent class decorated with @SynapseApi
      SynapseApiReflect.init(ctor.prototype, conf);

      return res;
    };

    newCtor = renameFn(newCtor, ctor.prototype.constructor.name);
    newCtor.prototype = ctor.prototype;

    // copy static values
    Object.keys(ctor).forEach(k => newCtor[k] = ctor[k]);

    return newCtor as any;
  }

  function renameFn(fn, name) {
    return new Function('fn', `return function ${name}() {\n return fn.apply(this, arguments);\n}`)(fn);
  }
}
