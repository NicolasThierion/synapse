import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersApi } from '../users/users.api';
import { GET, PathParam, QueryParams, SynapseApi } from '../../../src/core/decorators';

const BASE_URL = 'https://mon-prod-url';

@Component({
  selector: 'ack-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private _users: UsersApi;

  public constructor(private http: HttpClient) {
    const searchParameters = {
      name: 'toto',
      age: 12,
      city: 'Paris'
    };
    this.searchUser(searchParameters);
  }

  getUser(userId: number) {
    this.http.get(BASE_URL + '/users/' + userId);
  }

  getAccount(accountId: number) {
    this.http.get(BASE_URL + '/accounts/' + accountId, {
      headers: {
        authorisation: '$$mySecretAuthToken$$'
      }
    });
  }

  searchUser(searchParameters) {
    this.http.get(BASE_URL + '/users?name=' + searchParameters.name
      + (searchParameters.age ? '&age=' + searchParameters.age : '')
      + (searchParameters.city ? 'city=' + searchParameters.city : ''));
  }

  ngOnInit(): void {
    this._users.getOne(1).subscribe((res) => {
      console.log(res);
    });
  }
}

// => https://mon-prod-url / users
@SynapseApi({
  baseUrl: BASE_URL,
  path: ''
})
class UserApi {

  @GET('users/:id')
  // => https://mon-prod-url / users / 10
  getUser(@PathParam() userId: number) {

  }

  @GET('accounts/:id')
  getAccount(@PathParam() accountId: number) {

  }

  @GET({
    path: 'users'
  })
  // => https://mon-prod-url / users ? .. & ...& ...
  searchUser(@QueryParams() searchParameters) {
  }
}

