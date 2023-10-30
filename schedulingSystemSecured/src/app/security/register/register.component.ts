import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { UsersModel } from 'src/app/users/users.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public responseMessage = "";

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
  }

  public onSubmit(userData: UsersModel){
     this.securityService.registerUser(userData).subscribe(
      data => this.responseMessage = data,
      error => this.responseMessage = error.error
     );
  }

}
