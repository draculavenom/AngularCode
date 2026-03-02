import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../../security/security.service';
import { AppointmentModel } from './appointment.model';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  headers = {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "Accept": "*/*",
    "Authorization": ""
  };

  constructor(private http: HttpClient, private securityService: SecurityService, private configService: ConfigService) {
    this.updateHeaders();
  }

  public getAppointment(id: number): Observable<AppointmentModel>{
    return this.http.get<AppointmentModel>(`${this.configService.apiUrl}/api/v1/Appointments/${id}`, {headers: this.headers, responseType: 'json'});
  }

  public getAppointments(userId: number): Observable<AppointmentModel[]>{
    return this.http.get<AppointmentModel[]>(`${this.configService.apiUrl}/api/v1/Appointments/byUserId/${userId}`, {headers: this.headers, responseType: 'json'});
  }

  public getManagerAppointments(userId: number): Observable<AppointmentModel[]>{
    return this.http.get<AppointmentModel[]>(`${this.configService.apiUrl}/api/v1/Appointments/byManagerId/${userId}`, {headers: this.headers, responseType: 'json'});
  }

  public getAdminAppointments(): Observable<AppointmentModel[]>{
    return this.http.get<AppointmentModel[]>(`${this.configService.apiUrl}/api/v1/Appointments`, {headers: this.headers, responseType: 'json'});
  }

  public createAppointment(appointmentData: AppointmentModel): Observable<AppointmentModel>{
    return this.http.post<AppointmentModel>(`${this.configService.apiUrl}/api/v1/Appointments`, appointmentData, {headers: this.headers, responseType: 'json'});
  }

  public updateAppointment(appointmentData: AppointmentModel): Observable<AppointmentModel>{
    return this.http.put<AppointmentModel>(`${this.configService.apiUrl}/api/v1/Appointments`, appointmentData, {headers: this.headers, responseType: 'json'});
  }

  public cancelAppointment(id: number, comment: string): Observable<AppointmentModel>{
    return this.http.delete<AppointmentModel>(`${this.configService.apiUrl}/api/v1/Appointments/${id}`, {headers: this.headers, params: { comment: comment }, responseType: 'json'});
  }

  public confirmAppointment(id: number, comment: string): Observable<AppointmentModel>{
    let data = {"status": "CONFIRMED", "id": id, comment: comment};
    return this.http.put<AppointmentModel>(`${this.configService.apiUrl}/api/v1/Appointments/updateStatus`, data, {headers: this.headers, params: { comment: comment }, responseType: 'json'});
  }

  public completeAppointment(id: number, comment: string): Observable<AppointmentModel>{
    let data = {"status": "COMPLETED", "id": id, comment: comment};
    return this.http.put<AppointmentModel>(`${this.configService.apiUrl}/api/v1/Appointments/updateStatus`, data, {headers: this.headers, params: { comment: comment }, responseType: 'json'});
  }
  public updateStatus(payload: any): Observable<AppointmentModel> {
    return this.http.put<AppointmentModel>(
      `${this.configService.apiUrl}/api/v1/Appointments/updateStatus`, 
      payload, 
      { headers: this.headers, responseType: 'json' }
    );
  }
  private updateHeaders(){
    this.headers["Authorization"] = "Bearer " + this.securityService.getBearerToken();
  }
}
