import { isFunction, isString } from 'lodash';
import { Constructor, renameFn, validateHttpBackendAdapter } from '../../utils';
import { SynapseApiConfig } from '../api-config.type';
import { SynapseConfig } from '../config.type';
import { SynapseApiClass } from '../synapse-api.type';
import { SynapseApiReflect } from './synapse-api.reflect';

/**
 * Use this decorator on your web API class.
 *
 * You can specify an optional resource path to this API, or a complete {@link SynapseApiConfig},
 * that will applies to this class and all of its sub classes.
 *
 * @param confOrCtor The configuration of the SynapseApi Class
 */
export function SynapseApi(confOrCtor: string | SynapseApiConfig | Constructor<any> = ''): ClassDecorator | any {
  // if called SynapseApi(...???...)
  if (!isFunction(confOrCtor)) {
    return (ctor: Constructor<SynapseApiClass>) => {
      if (!ctor) { throw new Error('assertion error'); }
      confOrCtor = isString(confOrCtor) ? {path: confOrCtor as string} : /* cloneDeep */(confOrCtor) as SynapseApiConfig;

      return _makeNewCtor(ctor, confOrCtor);
    };
  } else {
    // if called SynapseApi
    return _makeNewCtor(confOrCtor as Constructor<SynapseApiClass>, {path: ''});
  }

  function _makeNewCtor(ctor: Constructor<SynapseApiClass>, conf: SynapseApiConfig): Constructor<SynapseApiClass> {
    // tslint:disable no-invalid-this
    if (conf.httpBackend) {
      validateHttpBackendAdapter(conf.httpBackend);
    }

    // decorate constructor to add config within reflect metadata
    let newCtor: Constructor<SynapseApiClass> = function(...args: any[]): SynapseApiClass {

      // call decoree constructor
      ctor.apply(this as any, args);

      // store conf within metadata.
      // !!! It is important to call constructor before, to register config of any parent class decorated with @SynapseApi
      // !!! x2 => this should be done lazily (at runtime when ctor is executed)
      // to let a chance to Synapse.init() to get called before this.
      asyncInit();

      return this;
      // tslint:enable no-invalid-this
    } as any;

    const proto = ctor.prototype;
    newCtor = renameFn(newCtor, proto.constructor.name);
    newCtor.prototype = proto;

    Object.defineProperty(proto, 'synapseConfig', {
      get: asyncInit
    });

    // copy static values
    Object.keys(ctor).forEach(k => newCtor[k] = ctor[k]);

    function asyncInit(): SynapseApiConfig & SynapseConfig {

      // if already enhanced
      if (SynapseApiReflect.hasConf(ctor.prototype)) {
        return SynapseApiReflect.getConf(ctor.prototype);
      }

      // else, init config
      return SynapseApiReflect.init(ctor.prototype, conf);
    }

    return newCtor;
  }

}
