import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/security/security.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  headers = {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "Accept": "*/*",
    "Authorization": ""
  };

  constructor(private http: HttpClient, private securityService: SecurityService) {
    this.updateHeaders();
  }
  
  public createManagerOptions(manager: ManagerOptionsModel): Observable<ManagerOptionsModel>{
    return this.http.post<ManagerOptionsModel>('http://localhost:8080/api/v1/Manager', manager, {headers: this.headers, responseType: 'json'});
  }

  private updateHeaders(){
    this.headers["Authorization"] = "Bearer " + this.securityService.getBearerToken();
  }
}
