import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/security/security.service';
import { UserService } from 'src/app/users/user.service';
import { UsersModel } from 'src/app/users/users.model';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {
  username = "";
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

}
