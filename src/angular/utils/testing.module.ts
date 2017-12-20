import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SynapseModule } from '../synapse.module';

export const BASE_URL = 'https://some-base-url';

/**
 * Import this module to set up test environment for testing Synapse project
 */
@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SynapseModule.forRoot({
      baseUrl : BASE_URL
    })
  ],
})
export class TestingModule {
}
