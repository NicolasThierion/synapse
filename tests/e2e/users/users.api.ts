import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { Body, GET, Headers, PathParam, PATCH, POST, PUT, QueryParams, SynapseApi, Synapse} from '@ack/synapse';

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
  getPage(params?: URLSearchParams): Observable<User> {
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
