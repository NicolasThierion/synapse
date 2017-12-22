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
    url: '/'
  })
  getPage(params?: URLSearchParams): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @GET({
    url: '/:id'
  })
  getOne(@PathParam() id: number, @QueryParams()  params?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @POST({
    url: '/'
  })
  postOne(@Body() user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @PUT({
    url: '/'
  })
  putOne(@Body() user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @PATCH({
    url: '/'
  })
  patchOne(@Body() user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }
}
