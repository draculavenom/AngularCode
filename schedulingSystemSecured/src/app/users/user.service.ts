import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { UsersModel } from './users.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "Accept": "*/*",
    "Authorization": ""
  };

  constructor(private http: HttpClient, private securityService: SecurityService) {
    
   }

  public getUser(): Observable<UsersModel>{
    let token = sessionStorage.getItem('bearerToken');
    let tokenInfo = "";
    let email = "";
    if (token !== null){
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      email = tokenInfo.sub.toString();
      this.headers["Authorization"] = "Bearer " + this.securityService.getBearerToken();
    }
    return this.getUserByEmail(email);
  }

  public getUserByEmail(email: string): Observable<UsersModel>{
    return this.http.get<UsersModel>('http://localhost:8080/api/v1/Users/byEmail/' + email, {headers: this.headers, responseType: 'json'});
  }

  public getUsers(): Observable<UsersModel[]>{
    return this.http.get<UsersModel[]>('http://localhost:8080/api/v1/Users', {headers: this.headers, responseType: 'json'});
  }
}
