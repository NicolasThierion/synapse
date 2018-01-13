import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { UsersModule } from '../users/users.module';
import { AppComponent } from './app.component';
import { SynapseModule } from '../../../src/angular';

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
// A sample app that make use of synapse-api for test purpose
export class AppModule {


}
