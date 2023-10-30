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
    return this.http.post('http://localhost:8080/auth/register', userData, {headers: this.headers, responseType: 'text'});

  }

  public loginUser(userData: UsersModel){
    return this.http.post('http://localhost:8080/auth/login', userData, {headers: this.headers, responseType: 'text'});
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

  public testBackend(){
    
    const body = {
      "username": "user",
      "password": "password"
    };
    const req = this.http.post('http://localhost:8080/auth/test', body, {headers: this.headers, responseType: 'text'});
    req.subscribe(
      data => console.log('data', data),
      error => console.log('error', error)
    );
    const reqU = this.http.post('http://localhost:8080/auth/getAUser', body, {headers: this.headers});
    reqU.subscribe(
      data => console.log('data', data),
      error => console.log('error', error)
    );
  }
}
