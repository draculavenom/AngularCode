import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../security/security.service';

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

  public getUser(){
    let token = sessionStorage.getItem('bearerToken');
    let bearerToken = "";
    let tokenInfo = "";
    let email = "";
    if (token !== null){
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      email = tokenInfo.sub.toString();
      bearerToken = token.split("\",\"")[0].split("\":\"")[1];
      this.headers["Authorization"] = "Bearer " + bearerToken;
      console.log(this.headers);
    }
    return this.getUserByEmail(email);
  }

  public getUserByEmail(email: string){
    return this.http.get('http://localhost:8080/api/v1/Users/byEmail/' + email, {headers: this.headers, responseType: 'json'});
  }
}
