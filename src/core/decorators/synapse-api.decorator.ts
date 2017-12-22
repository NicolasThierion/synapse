import * as _ from 'lodash';
import { HttpBackendAdapter } from '../http-backend.interface';
import { Synapse } from '../core';
import { SynapseConf } from '../synapse-conf';
import { SynapseApiReflect } from './synapse-api.reflect';
import SynapseApiAnnotatedClass = SynapseApiReflect.SynapseApiClass;

export interface SynapseApiConfig {
  path?: string;
  baseUrl?: string;
  httpBackend?: HttpBackendAdapter;
  headers?: Object;
  // TODO support for mappers
  // TODO support for handler
}

export function SynapseApi(conf: string | SynapseApiConfig = ''): ClassDecorator {
  return (ctor: any) => {

    // decorate constructor to add config within reflect metadata
    const newCtor = function(...args: any[]): SynapseApiAnnotatedClass {

      // retrieve global config
      const globalConf = Synapse.getConfig();

      // patch ot with local @SynapseApi config.
      const conf_: SynapseApiConfig & SynapseConf = _.isString(conf) ?
        _.defaultsDeep({path: conf as string}, globalConf)
        :  _.defaultsDeep(conf as SynapseApiConfig, globalConf);

      // store conf within metadata
      SynapseApiReflect.init(ctor.prototype, conf_);

      // call the decoree
      return new ctor(args);
    };

    newCtor.prototype = ctor.prototype;

    return newCtor as any;
  };
}
