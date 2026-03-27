import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { SecurityService } from '../security/security.service';
import { UsersModel } from '../users/users.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit {
  self: UsersModel = new UsersModel(0, "", false);
  isLoggedIn: boolean = false;
  tokenId: number = 0;

  constructor(private router: Router, private userService: UserService, 
    private securityService: SecurityService,
    private translate: TranslateService) {}
  
    get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  ngOnInit() {
    this.isLoggedIn = this.securityService.isUserLoggedIn();
    if (this.isLoggedIn) {
      this.getTokenId();
    }
  }
  public getTokenId() {
    let token = sessionStorage.getItem('bearerToken');
    let tokenInfo: any = {};
    if (token !== null) {
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      this.userService.getUser().subscribe(u => this.self = u);
      this.tokenId = tokenInfo.jti;
    }
  }
  

  goToLogin() {
    this.router.navigate(['/login']);
  }


}