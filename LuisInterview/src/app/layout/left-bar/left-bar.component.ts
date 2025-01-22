import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/security/security.service';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {
  username = "";

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

}
