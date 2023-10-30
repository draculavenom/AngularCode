import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security/security.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    //this.securityService.testBackend();//this request was done to test the communitation between my backend and the frontend
  }

}
