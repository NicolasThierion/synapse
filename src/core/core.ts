import { Observable } from 'rxjs/Observable';

import '../utils/rxjs-import';
import { SynapseConfig } from './config.type';
import { assert } from '../utils/assert';
import { mergeConfigs, validateHttpBackendAdapter } from '../utils/utils';

declare const global: {
  __SynapseConfig: SynapseConfig
};

class StateError extends Error {
  constructor(s: string) {
    super(s);
  }
}

export class Synapse {
  public static readonly OBSERVABLE = Observable.throw(
    'should only use SynapseConfig.OBSERVABLE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  public static readonly PROMISE = Promise.reject(
    'should only use SynapseConfig.PROMISE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  public static init(conf: SynapseConfig): void {
    if (global.__SynapseConfig) {
      assert(false);
      throw new StateError('Synapse already initialized');
    }

    conf = mergeConfigs(conf, SynapseConfig.DEFAULT);
    validateHttpBackendAdapter(conf.httpBackend);

    global.__SynapseConfig = conf;
  }

  public static getConfig(): SynapseConfig {
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
