import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/security/security.service';
import { UserService } from 'src/app/users/user.service';
import { UsersModel } from 'src/app/users/users.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string = "";
  user: UsersModel = new UsersModel(0, "", false);

  constructor(private securityService: SecurityService, private userService: UserService) { }

  ngOnInit(): void {
    this.checkToken();
  }

  private checkToken(){
    let token = sessionStorage.getItem('bearerToken');
    let tokenInfo = "";
    if (token !== null){
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      this.userService.getUser().subscribe(u => this.user = u);
      this.username = tokenInfo.sub.toString();
    }
  }

  logout(){
    ///api/v1/auth/logout
    this.securityService.logout().subscribe(answer => console.log(answer), error => console.log(error));
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("bearerToken");
    location.reload();
  }
}
