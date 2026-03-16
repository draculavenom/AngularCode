import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LegalService {

  private getJsonUrl(lang: string) {
    return `assets/legal-content-${lang}.json`;
  }

  constructor(
    private http: HttpClient,
    private translate: TranslateService 
  ) {}

  getLegalContent(type: string): Observable<any> {
   
    const lang = this.translate.currentLang || 'en';
    const url = this.getJsonUrl(lang);

    return this.http.get<any>(url).pipe(
      map((data: any) => data[type])
    );
  }
}