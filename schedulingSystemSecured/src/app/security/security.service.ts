import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersModel } from '../users/users.model';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  headers = {
    "content-type": "application/json",
    "Accept": "*/*"
  };

  token: any;

  constructor(private http: HttpClient) {}

  public isUserLoggedIn(){
    this.token = sessionStorage.getItem('bearerToken');
    return !(this.token === null)
  }

  public registerUser(userData: UsersModel): Observable<string>{
    return this.http.post('http://localhost:8080/api/v1/auth/registerUser', userData, {headers: this.headers, responseType: 'text'});

  }

  public loginUser(userData: UsersModel){
    return this.http.post('http://localhost:8080/api/v1/auth/authenticate', userData, {headers: this.headers, responseType: 'text'});
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
