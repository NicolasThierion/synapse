import { Observable } from 'rxjs/Observable';

import '../utils/rxjs-import';
import { SynapseConf } from './synapse-conf';
import { assert } from '../utils/assert';
import { mergeConfigs, validateHttpBackendAdapter } from '../utils/utils';

declare const global: {
  __SynapseConfig: SynapseConf
};

class StateError extends Error {
  constructor(s: string) {
    super(s);
  }
}

export class Synapse {
  public static readonly OBSERVABLE = Observable.throw(
    'should only use SynapseConf.OBSERVABLE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  public static readonly PROMISE = Promise.reject(
    'should only use SynapseConf.PROMISE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  public static init(conf: SynapseConf): void {
    if (global.__SynapseConfig) {
      assert(false);
      throw new StateError('Synapse already initialized');
    }

    conf = mergeConfigs(conf, SynapseConf.DEFAULT);
    validateHttpBackendAdapter(conf.httpBackend);

    global.__SynapseConfig = conf;
  }

  public static getConfig(): SynapseConf {
    if (!global.__SynapseConfig) {
      throw new StateError('Synapse not initialized');
    }
    return global.__SynapseConfig;
  }

  public static teardown(): void {
    global.__SynapseConfig = null;
  }
}

export * from './decorators/index';
export * from './http-backend';
