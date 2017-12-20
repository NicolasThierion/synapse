import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SynapseModule } from '@ack/synapse';
import { AppComponent } from './app.component';
import { UsersModule } from '../users/users.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    UsersModule,
    SynapseModule.forRoot({
      baseUrl : 'https://jsonplaceholder.typicode.com'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
// A sample app that make use of rest-client for test purpose
export class AppModule {


}
