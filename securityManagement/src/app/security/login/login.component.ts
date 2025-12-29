import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { UsersModel } from 'src/app/users/users.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  responseMessage =  "";

  constructor(private securityService: SecurityService, private router: Router) { }

  ngOnInit(): void {
    if(this.checkToken())
      this.router.navigate(['/']);
  }

  private checkToken(){
    let token = sessionStorage.getItem('bearerToken');
    return token !== null;
  }

  public onSubmit(userData: UsersModel){
    this.responseMessage = "";
    this.securityService.loginUser(userData).subscribe({
      next: (data) => {
        sessionStorage.setItem('bearerToken', data);
        this.responseMessage = "Authetication successful.";
        this.getUserDetails(data);
        setTimeout(() => {
            location.reload();
        }, 1500);
      },
      error: (err) => {
        this.responseMessage = "The username or password is incorrect. Please try again.";
      console.error("Error capturado:", err);
      }
    });
  }

  private getUserDetails(data: any){
    let tokenInfo = this.securityService.getDecodedAccessToken(data);
    console.log(tokenInfo);
  }

}
