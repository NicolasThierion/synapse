import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularSynapseConf, SynapseModule } from '../angular/synapse.module';
import { initAssert } from '../utils/assert';
import { AngularHttpBackendAdapter } from '../angular/angular-http-backend-adapter';
import { HttpBackendAdapter } from '../core/http-backend.interface';

class CustomBackendAdapter extends AngularHttpBackendAdapter {
}

/**
 * Global Synapse config used within tests
 */
export class Global {
  static readonly BASE_URL = 'https://some-base-url:80';
  static readonly HEADERS = {
    'X-global-header': 'some-global-value'
  };

  static readonly CONF: AngularSynapseConf = {
    baseUrl: Global.BASE_URL,
    headers: Global.HEADERS
  };
}

/**
 * Custom Synapse config used within tests
 */
export class Custom {
  static readonly BASE_URL = 'https://some-custom-base-url:80';
  static readonly HEADERS = {
    'X-custom-header': 'some-custom-value'
  };
  static BACKEND_ADAPTER: HttpBackendAdapter = new CustomBackendAdapter(null);

  static readonly CONF: AngularSynapseConf = {
    baseUrl: Custom.BASE_URL,
    headers: Custom.HEADERS,
    httpBackend: Custom.BACKEND_ADAPTER
  };
}

/**
 * Import this module to set up test environment for testing the Synapse project
 */
@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  exports: [
    SynapseModule
  ]
})
export class TestingModule {
  static readonly Global = Global;
  static readonly Custom = Custom;

  constructor() {
    initAssert(true);
  }

  static forRoot(conf: AngularSynapseConf = Global.CONF): ModuleWithProviders {
    return {
      ngModule: TestingModule,
      providers: [
        {provide: AngularSynapseConf, useValue: conf}
      ]
    };
  }
}
