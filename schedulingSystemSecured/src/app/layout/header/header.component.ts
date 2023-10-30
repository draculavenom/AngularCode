import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/security/security.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string = "";

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    this.checkToken();
  }

  private checkToken(){
    let token = sessionStorage.getItem('bearerToken');
    let tokenInfo = "";
    if (token !== null){
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      this.username = tokenInfo.sub.toString();
    }
  }

  logout(){
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("bearerToken");
    location.reload();
  }

}
