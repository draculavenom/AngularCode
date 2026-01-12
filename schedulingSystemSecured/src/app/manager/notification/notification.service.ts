import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../../security/security.service';
import { ConfigService } from '../../services/config.service';
import { Observable } from 'rxjs';

export interface NotificationSettings {
  emailEnabled: boolean;
  appointmentCreated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  headers = {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "Accept": "*/*",
    "Authorization": ""
  };

  constructor(
    private http: HttpClient, 
    private securityService: SecurityService, 
    private configService: ConfigService
  ) {
    this.updateHeaders();
  }

  public getSelfSettings(): Observable<NotificationSettings> {
    this.updateHeaders(); 
    return this.http.get<NotificationSettings>(
      `${this.configService.apiUrl}/api/v1/notification-settings/self`, 
      { headers: this.headers, responseType: 'json' }
    );
  }

  public updateSelfSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    this.updateHeaders();
    return this.http.put<NotificationSettings>(
      `${this.configService.apiUrl}/api/v1/notification-settings/self`, 
      settings, 
      { headers: this.headers, responseType: 'json' }
    );
  }

  private updateHeaders() {
    this.headers["Authorization"] = "Bearer " + this.securityService.getBearerToken();
  }
}