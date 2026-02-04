import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/security/security.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';
import { ConfigService } from '../../services/config.service';

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

  constructor(private http: HttpClient, private securityService: SecurityService, private configService: ConfigService) {
    this.updateHeaders();
  }

  public createManagerOptions(manager: ManagerOptionsModel): Observable<ManagerOptionsModel> {
    return this.http.post<ManagerOptionsModel>(`${this.configService.apiUrl}/api/v1/Manager`, manager, { headers: this.headers, responseType: 'json' });
  }

  public getManagerOptions(managerId: number): Observable<ManagerOptionsModel[]> {
    this.updateHeaders();
    return this.http.get<ManagerOptionsModel[]>(`${this.configService.apiUrl}/api/v1/Manager/${managerId}/options`, { headers: this.headers });
  }

  public updateCompany(managerId: number, options: ManagerOptionsModel): Observable<any> {
    this.updateHeaders();
    const companyDto = { companyName: options.nameCompany || '' };
    return this.http.put(`${this.configService.apiUrl}/api/v1/Manager/${managerId}/company`, companyDto, { headers: this.headers });
  }

  public getManagerFullData(managerId: number): Observable<any> {
    this.updateHeaders();
    return this.http.get<any>(`${this.configService.apiUrl}/api/v1/Manager/${managerId}`, { headers: this.headers });
  }
  public getManagerNameSelect(): Observable<any> {
    this.updateHeaders();
    return this.http.get<any[]>(`${this.configService.apiUrl}/api/v1/Manager/company`, { headers: this.headers });
  }

  private updateHeaders() {
    this.headers["Authorization"] = "Bearer " + this.securityService.getBearerToken();
  }
}
