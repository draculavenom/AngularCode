import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../../security/security.service';
import { AppointmentModel } from './appointment.model';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient, private securityService: SecurityService) {
    this.updateHeaders();
  }

  public getAppointment(id: number): Observable<AppointmentModel>{
    return this.http.get<AppointmentModel>('http://localhost:8080/api/v1/Appointments/' + id, {headers: this.headers, responseType: 'json'});
  }

  public getAppointments(userId: number): Observable<AppointmentModel[]>{
    return this.http.get<AppointmentModel[]>('http://localhost:8080/api/v1/Appointments/byUserId/' + userId, {headers: this.headers, responseType: 'json'});
  }

  public getManagerAppointments(userId: number): Observable<AppointmentModel[]>{
    return this.http.get<AppointmentModel[]>('http://localhost:8080/api/v1/Appointments/byManagerId/' + userId, {headers: this.headers, responseType: 'json'});
  }

  public getAdminAppointments(userId: number): Observable<AppointmentModel[]>{
    return this.http.get<AppointmentModel[]>('http://localhost:8080/api/v1/Appointments', {headers: this.headers, responseType: 'json'});
  }

  public createAppointment(appointmentData: AppointmentModel): Observable<AppointmentModel>{
    return this.http.post<AppointmentModel>("http://localhost:8080/api/v1/Appointments", appointmentData, {headers: this.headers, responseType: 'json'});
  }

  public updateAppointment(appointmentData: AppointmentModel): Observable<AppointmentModel>{
    return this.http.put<AppointmentModel>("http://localhost:8080/api/v1/Appointments", appointmentData, {headers: this.headers, responseType: 'json'});
  }

  public cancelAppointment(id: number): Observable<AppointmentModel>{
    return this.http.delete<AppointmentModel>("http://localhost:8080/api/v1/Appointments/" + id, {headers: this.headers, responseType: 'json'});
  }

  public confirmAppointment(id: number): Observable<AppointmentModel>{
    let data = {"status": "CONFIRMED", "id": id};
    return this.http.put<AppointmentModel>("http://localhost:8080/api/v1/Appointments/updateStatus", data, {headers: this.headers, responseType: 'json'});
  }

  public completeAppointment(id: number): Observable<AppointmentModel>{
    let data = {"status": "COMPLETED", "id": id};
    return this.http.put<AppointmentModel>("http://localhost:8080/api/v1/Appointments/updateStatus", data, {headers: this.headers, responseType: 'json'});
  }

  private updateHeaders(){
    this.headers["Authorization"] = "Bearer " + this.securityService.getBearerToken();
  }
}
