import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersModel } from '../users/users.model';
import { Observable, BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private loggedInStatus = new BehaviorSubject<boolean>(this.checkTokenExists());
  headers = {
    "content-type": "application/json",
    "Accept": "*/*"
  };

  token: any;

  constructor(private http: HttpClient,
    private configService: ConfigService
  ) {}

  get authStatus$() {
    return this.loggedInStatus.asObservable();
  }
  updateAuthStatus(status: boolean) {
    this.loggedInStatus.next(status);
  }

  private checkTokenExists(): boolean {
    return !!sessionStorage.getItem('bearerToken');
  }

  public isUserLoggedIn(): boolean{
    this.token = sessionStorage.getItem('bearerToken');
    return !(this.token === null)
  }


  public registerUser(userData: UsersModel): Observable<string>{
    return this.http.post(`${this.configService.apiUrl}/api/v1/auth/registerUser`, userData, {headers: this.headers, responseType: 'text'});

  }

  public loginUser(userData: any): Observable<string>{
    return this.http.post(`${this.configService.apiUrl}/api/v1/auth/authenticate`, userData, { responseType: 'text'});
  }

  public logout(){
    let headersWithToken = {
      "content-type": "application/json",
      "Accept": "*/*",
      "Authorization": "Bearer " + this.getBearerToken()
    };
    return this.http.post(`${this.configService.apiUrl}/api/v1/auth/logout`, null, {headers: headersWithToken, responseType: 'text'});
  }

  public getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token); 
    } catch(Error) {
      return null;
    }
  }

  public getToken(): string{
    return this.token;
  }

  public getBearerToken(): string{
    let token = sessionStorage.getItem('bearerToken');
    let bearerToken = "";
    if (token !== null){
      bearerToken = token.split("\",\"")[0].split("\":\"")[1];
    }
    return bearerToken;
  }
}
