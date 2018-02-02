import { Component } from '@angular/core';
import { UsersApi } from '../../../utils/user-api';

@Component({
  selector: 'syn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {

  readonly dummyPage = {'id': [15, 16, 17]};
  readonly dummyId = 42;
  readonly dummyUser = {
    firstName: 'Avrell',
    lastName: 'Dalton',
    username: 'aDalton',
    email: 'a.Dalton@yahoo.com'
  };

  public constructor(public users: UsersApi) {
  }
}
