import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LegalService {
  private jsonUrl = 'assets/legal-content.json';

  constructor(private http: HttpClient) {}

  getLegalContent(type: string): Observable<any> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((data: any) => data[type])
    ) as Observable<any>;
  }
}