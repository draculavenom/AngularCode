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
    this.securityService.loginUser(userData).subscribe(
      data => {
        sessionStorage.setItem('bearerToken', data);
        this.responseMessage = "Authetication successful.";
        this.getUserDetails(data);
        location.reload();
      },
      error => this.responseMessage = error.erorr
    );
  }

  private getUserDetails(data: any){
    let tokenInfo = this.securityService.getDecodedAccessToken(data);
    console.log(tokenInfo);
  }

}
