import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { Headers, Body, GET, PATCH, PathParam, POST, PUT, QueryParams, SynapseApi } from '../../../src/core/decorators';
import { Synapse } from '../../../src';

@SynapseApi({
  baseUrl: 'https://jsonplaceholder.typicode.com/',
  path: 'users'
})
@Injectable()
export class UsersApi {

  constructor() {
  }

  @GET({
    path: '/'
  })
  getPage(@QueryParams() params?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @GET({
    path: '/:id'
  })
  getOne(@PathParam() id: number, @QueryParams() params?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @POST({
    path: '/'
  })
  postOne(@Body() user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @PUT({
    path: '/'
  })
  putOne(@Body() user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @PATCH({
    path: '/'
  })
  patchOne(@Body() user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }
}
