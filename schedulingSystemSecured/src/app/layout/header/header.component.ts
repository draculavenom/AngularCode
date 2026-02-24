import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/security/security.service';
import { UserService } from 'src/app/users/user.service';
import { UsersModel } from 'src/app/users/users.model';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string = "";
  user: UsersModel = new UsersModel(0, "", false);
  isLoggedIn: boolean = false;
  lastPublicRoute: string = '/onboarding-final';

  constructor(private securityService: SecurityService, private userService: UserService, private location: Location, 
    private router: Router) {
      this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
    const url = event.url;
      if (url.includes('promo') || url.includes('onboarding-final')) {
        this.lastPublicRoute = url;
      }
    });
  }
handleHomeClick() {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate([this.lastPublicRoute]);
    }
  }

  ngOnInit(): void {
    this.securityService.authStatus$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        setTimeout(() => {
        this.checkToken();
      }, 0);
      } else {
        this.username = "";
        this.user = new UsersModel(0, "", false);
      }
    });
  }

  private checkToken(){
    let token = sessionStorage.getItem('bearerToken');
    let tokenInfo = "";
    if (token !== null){
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      this.userService.getUser().subscribe(u => this.user = u);
      if (tokenInfo && tokenInfo.sub) {
        this.username = tokenInfo.sub.toString();
      }
      this.userService.getUser().subscribe({
      next: (u) => {
        this.user = u;
      },
      error: (err) => console.error("Error loading user", err)
    });
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
