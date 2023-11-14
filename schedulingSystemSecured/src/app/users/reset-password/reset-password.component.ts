import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/security/security.service';
import { UsersModel } from '../users.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  user: UsersModel = new UsersModel(0, "", false);
  responseMessage: string = "";
  message: string = "";
  repeatPassword: string = "";
  messageType: string = "danger";

  constructor(
    private route: ActivatedRoute, 
    private securityService: SecurityService, 
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getParams();
  }

  public getParams(){
    this.route.queryParams.subscribe(params => {
      if(params['email'] !== null && params['email'] !== undefined)
        this.user.email = params['email'];
      if(params['password'] !== null && params['password'] !== undefined)
        this.user.password = params['password'];
      this.securityService.loginUser(this.user).subscribe(data => {
        sessionStorage.setItem('bearerToken', data);
        this.userService.getUser().subscribe(u => {
          this.user.passwordChange = u.passwordChange;
          this.user.id = u.id;
          if(!this.user.passwordChange)
            this.responseMessage = "You cannot change your password, please contact your Manager and ask him for a password reset if you want to change it.";
        });
      }, error => this.responseMessage = "Incorrect credentials. Check the link sent to your email again please.");
    });
  }

  public changePassword(){
    if(this.validatePasswords())
      this.userService.changePassword(this.user).subscribe(ans => {
        this.message = "Password changed.";
        this.messageType = "success";
    });
  }

  private validatePasswords(): boolean{
    if(this.repeatPassword != this.user.password){
      this.message = "The password doesn't match.";
      return false;
    }
    return true;
  }

}
