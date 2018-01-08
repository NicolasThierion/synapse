import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Synapse } from '../core/core';
import { AngularHttpBackendAdapter } from './angular-http-backend-adapter';
import { HttpClient } from '@angular/common/http';
import { throwIfAlreadyLoaded } from './utils/module-import-guard';
import { SynapseConfig } from '../core/config.type';
import { validateHttpBackendAdapter } from '../utils/utils';

/**
 * Register this module using {@link SynapseModule#forRoot} to be able to use Synapse decorators within your app.
 * This module should be registered once, by your root module (usually named **"AppModule"**).
 * Please note that if you use the {@link AngularHttpBackendAdapter} (this is the case if you don't override **httpBackend** property),
 * you should import BrowserModule & HttpClientModule
 */
@NgModule()
export class SynapseModule {
  constructor(@Optional() http: HttpClient, @Optional() @SkipSelf() parentModule: SynapseModule, conf: SynapseConfig) {
    throwIfAlreadyLoaded(parentModule, 'SynapseModule');
    if (!conf.httpBackend) {

      if (!http) {
        throw new Error(
          'Cannot find dependency HttpClient. Make sure you import BrowserModule & HttpClientModule within your root module.');
      }
      conf.httpBackend = new AngularHttpBackendAdapter(http);
    } else {
      validateHttpBackendAdapter(conf.httpBackend);
    }

    Synapse.init(conf as SynapseConfig);
  }

  static forRoot(conf: SynapseConfig): ModuleWithProviders {
    return {
      ngModule: SynapseModule,
      providers: [
        {provide: SynapseConfig, useValue: conf}
      ]
    };
  }
}
