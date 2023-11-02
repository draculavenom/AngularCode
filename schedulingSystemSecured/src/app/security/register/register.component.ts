import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { UsersModel } from 'src/app/users/users.model';
import { UserService } from 'src/app/users/user.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public responseMessage = "";
  user: UsersModel = new UsersModel(0, "", true);
  managerSelect: ManagerOptionsModel[] = [new ManagerOptionsModel(0)];

  constructor(
      private securityService: SecurityService, 
      private userService: UserService, 
      private router: Router
    ) { }

  ngOnInit(): void {
    this.setDefault();
  }

  public setDefault(){
    this.user.role = "USER";
    this.userService.getManagerSelect().subscribe(l => this.managerSelect = l);
  }

  public onSubmit(userData: UsersModel){
     this.securityService.registerUser(userData).subscribe(
      data => {
        sessionStorage.setItem('bearerToken', data);
        this.responseMessage = "Authetication successful.";
        this.router.navigate(['/']);
      },
      error => this.responseMessage = error.error
     );
  }

}
