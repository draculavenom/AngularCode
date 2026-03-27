import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

  constructor(private translate: TranslateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Se obtiene el idioma activo. 
    // Si no hay uno seleccionado, usamos el idioma por defecto el cual es ingles
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';

    // Se clona la petición original para añadir el encabezado 'Accept-Language'
    // Se utiliza el método clone() porque las peticiones HTTP en Angular son inmutables, por lo que no se pueden modificar directamente.
    const authRequest = request.clone({
      setHeaders: {
        'Accept-Language': lang
      }
    });

    // Se envía la petición clonada al siguiente manejador
    return next.handle(authRequest);
  }
}