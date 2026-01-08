import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { UsersModel } from './users.model';
import { Observable } from 'rxjs';
import { ManagerOptionsModel } from './manager.options';
import { UserDTO } from './manager-users-list/manager-user-list-model';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient, private securityService: SecurityService, private configService: ConfigService) {

  }
  private getRequestOptions() {
    const token = sessionStorage.getItem('bearerToken');
    let authHeader = "";

    if (token) {
      try {
        // Intentamos ver si es un JSON
        const parsed = JSON.parse(token);
        authHeader = "Bearer " + (parsed.access_token || parsed);
      } catch (e) {
        // Si no es JSON, es el string directo
        authHeader = "Bearer " + token;
      }
    }

    // IMPORTANTE: Solo agregar Authorization si el token existe
    const headersConfig: any = {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    };

    if (authHeader) {
      headersConfig['Authorization'] = authHeader;
    }

    return {
      headers: new HttpHeaders(headersConfig)
    };
  }

  public getUser(): Observable<UsersModel> {
    const token = sessionStorage.getItem('bearerToken');
    // let tokenInfo = "";
    let email = "";
    //let headers = new HttpHeaders();
    if (token) {
      try {
        const tokenObject = JSON.parse(token);
        //const accessToken = tokenObject.access_token;
        const tokenInfo = this.securityService.getDecodedAccessToken(tokenObject.access_token);
        email = tokenInfo.sub.toString();
      } catch (error) {
        console.error("Error al obtener el email del  token:", error);
      }
    }
    return this.getUserByEmail(email);
  }

  public getUserById(id: number): Observable<UsersModel> {
    return this.http.get<UsersModel>(`${this.configService.apiUrl}/api/v1/Users/${id}`, this.getRequestOptions());
  }

  public getUserByEmail(email: string): Observable<UsersModel> {
    return this.http.get<UsersModel>(`${this.configService.apiUrl}/api/v1/Users/byEmail/${email}`, this.getRequestOptions());
  }

  public getUsers(): Observable<UsersModel[]> {
    return this.http.get<UsersModel[]>(`${this.configService.apiUrl}/api/v1/Users`, this.getRequestOptions());
  }

  public createUser(user: UsersModel): Observable<UsersModel> {
    return this.http.post<UsersModel>(`${this.configService.apiUrl}/api/v1/Users`, user, this.getRequestOptions());
  }

  public updateUser(user: UsersModel): Observable<UsersModel> {
    return this.http.put<UsersModel>(`${this.configService.apiUrl}/api/v1/Users`, user, this.getRequestOptions());
  }

  public updateSelf(user: UsersModel): Observable<UsersModel> {
    return this.http.put<UsersModel>(`${this.configService.apiUrl}/api/v1/Users/self`, user, this.getRequestOptions());
  }

  public getManagerSelect(): Observable<ManagerOptionsModel[]> {
    return this.http.get<ManagerOptionsModel[]>(`${this.configService.apiUrl}/api/v1/Manager/select`, this.getRequestOptions());
  }

  public resetPassword(id: number) {
    return this.http.get<boolean>(`${this.configService.apiUrl}/api/v1/Users/resetPassword/${id}`, this.getRequestOptions());
  }

  public changePassword(user: UsersModel) {
    return this.http.put<UsersModel>(`${this.configService.apiUrl}/api/v1/Users/passwordChange`, user, this.getRequestOptions());
  }

  public getPersonsByManager(managerId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(
      `${this.configService.apiUrl}/api/v1/Manager/${managerId}/persons`,
      this.getRequestOptions()
    );
  }
}
