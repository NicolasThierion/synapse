import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Synapse } from '../core/core';
import { AngularHttpBackendAdapter } from './angular-http-backend-adapter';
import { HttpClient } from '@angular/common/http';
import { HttpBackendAdapter } from '../core/http-backend.interface';
import { throwIfAlreadyLoaded } from './utils/module-import-guard';
import * as _ from 'lodash';

/**
 * Configuration class for the Synapse Angular module
 */
export class AngularSynapseConf {
  baseUrl: string;
  httpBackend?: HttpBackendAdapter;
  headers?: Object;
}

@NgModule()
export class SynapseModule {
  constructor(@Optional() http: HttpClient, @Optional() @SkipSelf() parentModule: SynapseModule, conf: AngularSynapseConf) {
    throwIfAlreadyLoaded(parentModule, 'SynapseModule');
    if (!http) {
      throw new Error('Cannot find dependency HttpClient. Make sure you import BrowserModule & HttpClientModule within your root module.');
    }

    const conf_ = _.defaults(conf, {
      httpBackend: new AngularHttpBackendAdapter(http)
    });

    Synapse.init(conf_);
  }

  static forRoot(conf: AngularSynapseConf): ModuleWithProviders {
    return {
      ngModule: SynapseModule,
      providers: [
        {provide: AngularSynapseConf, useValue: conf}
      ]
    };
  }
}
