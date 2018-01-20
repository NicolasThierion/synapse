// tslint:disable no-implicit-dependencies

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObserveType, Synapse, TypedResponse } from '../../../src';
import { Body, DELETE, GET, Headers, PATCH, PathParam, POST, PUT, QueryParams, SynapseApi } from '../../../src/core/decorators';
import { User } from './models/user.model';
import { UserMapper } from './user.mapper';

const userMapper = new UserMapper();

@SynapseApi({
  baseUrl: 'http://localhost:3000',
  path: 'users'
})
@Injectable()
export class UsersApi {

  constructor() {
  }

  @GET({
    mapper: userMapper.fromJson
  })
  getPage(@QueryParams() params?: any): Observable<User[]> {
    return Synapse.OBSERVABLE;
  }

  @GET({path: '/:id', mapper: userMapper.fromJson})
  getOne(@PathParam() id: number): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  @GET({
    path: '/:id',
    mapper: userMapper.fromJson,
    observe: ObserveType.RESPONSE
  })
  getOneWithObserveResponse(@PathParam() id: number): Observable<TypedResponse<User>> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  postOne(@Body({
            contentType: Body.ContentType.PLAIN_TEXT,
            mapper: userMapper.toJson
          }) user: User,
          @Headers() headers?: any): Observable<Response> {
    return Synapse.OBSERVABLE;
  }

  @PUT()
  putOne(@Body({mapper: userMapper.toJson}) user: User, @Headers() headers?: any): Observable<Response> {
    return Synapse.OBSERVABLE;
  }

  @PATCH()
  patchOne(@Body({mapper: userMapper.toJson}) user: User, @Headers() headers?: any): Observable<Response> {
    return Synapse.OBSERVABLE;
  }

  @DELETE('/:id')
  deleteOne(@PathParam() id: number, @Headers() headers?: any): Observable<Response> {
    return Synapse.OBSERVABLE;
  }
}
