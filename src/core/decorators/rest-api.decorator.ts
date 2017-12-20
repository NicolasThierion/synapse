import * as _ from 'lodash';
import { HttpBackendAdapter } from '../http-backend.interface';
import { Synapse } from '../core';
import { SynapseConf } from '../synapse-conf';
import { RestApiReflect } from './rest-api.reflect';
import RestApiAnnotatedClass = RestApiReflect.RestApiClass;

export interface RestApiConfig {
  path?: string;
  baseUrl?: string;
  httpBackend?: HttpBackendAdapter;
  headers?: Object;
  // TODO support for mappers
  // TODO support for handler
}

export function RestApi(conf: string | RestApiConfig = ''): ClassDecorator {
  return (ctor: any) => {

    // decorate constructor to add config within reflect metadata
    const newCtor = function(...args: any[]): RestApiAnnotatedClass {

      // retrieve global config
      const globalConf = Synapse.getConfig();

      // patch ot with local @RestApi config.
      const conf_: RestApiConfig & SynapseConf = _.isString(conf) ?
        _.defaultsDeep({path: conf as string}, globalConf)
        :  _.defaultsDeep(conf as RestApiConfig, globalConf);

      // store conf within metadata
      RestApiReflect.init(ctor.prototype, conf_);

      // call the decoree
      return new ctor(args);
    };

    newCtor.prototype = ctor.prototype;

    return newCtor as any;
  };
}
