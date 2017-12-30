import { Component, OnInit } from '@angular/core';
import { UsersApi } from '../users/users.api';

@Component({
  selector: 'ack-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private _users: UsersApi;
  constructor(users: UsersApi) {
    this._users = users;
  }

  ngOnInit(): void {
    this._users.getOne(1).subscribe((res) => {
      console.log(res);
    });
  }
}
