// tslint:disable no-implicit-dependencies

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { SynapseModule } from '../../../../src/angular';
import { UsersApi } from '../../../utils/user-api';
import { AppComponent } from './app.component';
import { SynapseBenchComponent } from './synapse-bench/synapse-bench.component';

@NgModule({
  declarations: [
    AppComponent, SynapseBenchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]),
    SynapseModule.forRoot({
      baseUrl : 'http://localhost:3000'
    })
  ],
  exports: [
    SynapseBenchComponent, AppComponent
  ],
  providers: [UsersApi],
  bootstrap: [AppComponent]
})
// A sample app that make use of synapse-api for test purpose
export class AppModule { // tslint:disable-line no-unnecessary-class
}
