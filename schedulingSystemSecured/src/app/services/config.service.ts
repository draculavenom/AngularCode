import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) { }

  public loadConfig(): Promise<any> {
    return this.http.get('./assets/app-config.json')
      .pipe(
        map((res: any) => res)
      )
      .toPromise()
      .then((config: any) => { 
        this.config = config;
      })
      .catch((err: any) => {
        console.error('Error loading config', err);
        this.config = { apiUrl: 'http://localhost:8080' };
      });
  }

  get apiUrl(): string {
    return this.config ? this.config.apiUrl : '';
  }
}
