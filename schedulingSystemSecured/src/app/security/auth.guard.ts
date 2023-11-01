import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { SecurityService } from "./security.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private securityService: SecurityService, private router: Router){

    }

    canActivate(route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean {
        if (!this.securityService.isUserLoggedIn())
            this.router.navigate(["/login"]);
        return this.securityService.isUserLoggedIn();
    }

}