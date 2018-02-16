// tslint:disable no-unnecessary-class
// tslint:disable max-classes-per-file

// DO NOT REMOVE THIS ONE. AT the moment, it is needed for name resolution when generating .d.ts because of --declarations
import { ErrorObservable } from 'rxjs/observable/ErrorObservable'; // tslint:disable-line

// TODO remove those ?
import 'whatwg-fetch';          // Fetch API

// TODO whatwg-url uses es6 that needs to be transpiled to es5. But  as of 2018/01/11, ngc refuses to process js when "allowJs" is set,
// and complains because of bug https://github.com/angular/angular/issues/21080 So we need to use another polyfill.
import 'url-search-params-polyfill';            // UrlSearchParams

// import 'whatwg-url';            // UrlSearchParams uncomment when bug above is resolved

import { Observable } from 'rxjs/Observable';

import { assert, mergeConfigs, validateHttpBackendAdapter } from '../utils';
import '../utils/rxjs-import';
import { SynapseConfig } from './config.type';
import { SynapseApiReflect } from './decorators/synapse-api.reflect';

declare const global: {
  __SynapseConfig: SynapseConfig
};

class StateError extends Error {
  constructor(s: string) {
    super(s);
  }
}

// @dynamic
export class Synapse {
  static get OBSERVABLE(): Observable<any> {
    return Observable.throw(
      'should only use Synapse.OBSERVABLE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');
  }

  static get PROMISE(): Promise<any> {
    return Promise.reject(
      'should only use Synapse.PROMISE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');
  }

  static init(conf: SynapseConfig): void {
    if (global.__SynapseConfig) {
      assert(false);
      throw new StateError('Synapse already initialized');
    }

    conf = mergeConfigs(conf, SynapseConfig.DEFAULT);
    validateHttpBackendAdapter(conf.httpBackend);

    global.__SynapseConfig = conf;
  }

  static isInit(): boolean {
    return !!(global.__SynapseConfig);
  }

  static getConfig(): SynapseConfig {
    if (!global.__SynapseConfig) {
      throw new StateError('Synapse not initialized');
    }

    return global.__SynapseConfig;
  }

  static teardown(): void {
    global.__SynapseConfig = undefined;
    SynapseApiReflect.teardown();
  }
}

SynapseApiReflect.Synapse = Synapse; // removes circular import between core -> SynapseApiReflect-> core
