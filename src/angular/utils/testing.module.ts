import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularSynapseConf, SynapseModule } from '../synapse.module';
import { initAssert } from '../../utils/assert';

export const BASE_URL = 'https://some-base-url';
const HEADERS = {
  'X-custom-header': 'custom-header-value'
};
export const SYNAPSE_CONF: AngularSynapseConf = {
  baseUrl : BASE_URL,
  headers: HEADERS
};

/**
 * Import this module to set up test environment for testing Synapse project
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
  static readonly SYNAPSE_CONF = SYNAPSE_CONF;
  static readonly BASE_URL = BASE_URL;
  static readonly HEADERS = HEADERS;

  constructor() {
    initAssert(true);
  }

  static forRoot(conf: AngularSynapseConf = SYNAPSE_CONF): ModuleWithProviders {
    return {
      ngModule: TestingModule,
      providers: [
        {provide: AngularSynapseConf, useValue: conf}
      ]
    };
  }
}
