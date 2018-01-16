import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SynapseModule } from '../../../src/angular';
import { UsersApi } from '../../utils/user-api';
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
  providers: [UsersApi],
  bootstrap: [AppComponent]
})
// A sample app that make use of synapse-api for test purpose
export class AppModule {
}
