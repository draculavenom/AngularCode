import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getUsers() {
    const url = `${this.configService.apiUrl}/users`;
    return this.http.get(url);
  }
}