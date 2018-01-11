// TODO remove those ?
import 'core-js/es7/reflect';   // reflect api polyfill
import 'whatwg-fetch';          // Fetch API

// TODO whatwg-url uses es6 that needs to be transpiled to es5. But  as of 2018/01/11, ngc refuses to process js when "allowJs" is set,
// and complains because of bug https://github.com/angular/angular/issues/21080 So we need to use another polyfill.
import 'url-search-params-polyfill';            // UrlSearchParams

// import 'whatwg-url';            // UrlSearchParams uncomment when bug above is resolved

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
  static readonly OBSERVABLE = Observable.throw(
    'should only use SynapseConfig.OBSERVABLE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  static readonly PROMISE = Promise.reject(
    'should only use SynapseConfig.PROMISE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  static init(conf: SynapseConfig): void {
    if (global.__SynapseConfig) {
      assert(false);
      throw new StateError('Synapse already initialized');
    }

    conf = mergeConfigs(conf, SynapseConfig.DEFAULT);
    validateHttpBackendAdapter(conf.httpBackend);

    global.__SynapseConfig = conf;
  }

  static getConfig(): SynapseConfig {
    if (!global.__SynapseConfig) {
      throw new StateError('Synapse not initialized');
    }

    return global.__SynapseConfig;
  }

  static teardown(): void {
    global.__SynapseConfig = undefined;
  }
}

export * from './decorators/index';
export * from './http-backend';
export * from './api-config.type';
export * from './config.type';
export * from './endpoint-config.type';
export * from './mapper.type';
export * from './typed-response.model';
