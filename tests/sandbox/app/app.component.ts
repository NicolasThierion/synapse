import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersApi } from '../../utils/user-api';

@Component({
  selector: 'ack-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {

  public constructor(public users: UsersApi) {
  }
}


