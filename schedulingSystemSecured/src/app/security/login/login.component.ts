import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { UsersModel } from 'src/app/users/users.model';
import { Router } from '@angular/router';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  responseMessage = "";
  isError = false;

  constructor(private securityService: SecurityService, private router: Router) { }

  ngOnInit(): void {
    if (this.checkToken())
      this.router.navigate(['/schedule']);
  }

  private checkToken() {
    let token = sessionStorage.getItem('bearerToken');
    return token !== null;
  }

  public onSubmit(userData: UsersModel) {
    this.securityService.loginUser(userData).subscribe(
      data => {
        this.isError = false;
        sessionStorage.setItem('bearerToken', data);
        this.responseMessage = "Authentication successful.";
        this.getUserDetails(data);
        setTimeout(() => {
          location.reload();
        }, 1500);
      },
      error => {
        this.isError = true;

        const errorRaw = JSON.stringify(error);

        if (errorRaw.includes("SUBSCRIPTION_EXPIRED")) {
          this.responseMessage = "Access denied: Your subscription has expired.";
        } else if (error.status === 403 || error.status === 401) {
          this.responseMessage = "The username or password is incorrect. Please try again.";
        } else {
          this.responseMessage = "An unexpected error occurred.";
        }
      }
    );
  }

  private getUserDetails(data: any) {
    let tokenInfo = this.securityService.getDecodedAccessToken(data);
    console.log(tokenInfo);
  }

}
