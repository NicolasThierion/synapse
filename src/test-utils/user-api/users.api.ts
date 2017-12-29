import { Observable } from 'rxjs/Observable';
import { User } from './models/user.model';
import { Injectable } from '@angular/core';
import { Body, GET, Headers, PathParam, PATCH, POST, PUT, QueryParams, SynapseApi, Synapse, ContentType } from '@ack/synapse';
import { MockUserBackendAdapter } from './users-http-backend.mock.api';
import { UserMapper } from './user.mapper';

const userMapper = new UserMapper();

@SynapseApi({
  httpBackend: new MockUserBackendAdapter()
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

  @POST()
  postOne(@Body({
            contentType: ContentType.FORM_DATA,
            mapper: userMapper.fromJson
          }) user: User,
          @Headers() headers?: any): Observable<Response> {
    return Synapse.OBSERVABLE;
  }

  @PUT()
  putOne(@Body({mapper: userMapper.fromJson}) user: User, @Headers() headers?: any): Observable<Response> {
    return Synapse.OBSERVABLE;
  }

  @PATCH()
  patchOne(@Body({mapper: userMapper.fromJson}) user: User, @Headers() headers?: any): Observable<Response> {
    return Synapse.OBSERVABLE;
  }
}
