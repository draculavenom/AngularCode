import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DictionaryService } from '../services/dictionary.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[t]' // se usa para traducir cualquier texto que pongas dentro del HTML, sin necesidad de usar pipes o componentes adicionales. Solo pones t y listo.
})
export class AutoTranslateDirective implements AfterViewInit, OnDestroy {
  private originalText: string = '';
  private sub!: Subscription;
  private isTranslating = false;
  private originalPlaceholder: string = '';

  constructor(
    private el: ElementRef, 
    private translate: TranslateService,
    private dict: DictionaryService
  ) {}

  ngAfterViewInit() {
    //  Captura el texto que se escribe en el HTML
    this.originalText = this.el.nativeElement.innerText.trim();
    this.originalPlaceholder = this.el.nativeElement.getAttribute('placeholder') || '';
    
    //  Reacciona al cambio de idioma automáticamente
    this.sub = this.translate.onLangChange.subscribe(event => {
      this.applyTranslation(event.lang);
    });

    //  Traduce de inmediato al cargar
    this.applyTranslation(this.translate.currentLang || 'en');
  }

  private applyTranslation(lang: string) {
  // Traducir el texto interno  
  if (this.originalText) {
    this.el.nativeElement.innerText = lang === 'en' 
      ? this.originalText 
      : this.dict.translate(this.originalText, lang);
  }

  //  Traducir el placeholder si existe
  if (this.originalPlaceholder) {
      const translatedPlaceholder = lang === 'en'
        ? this.originalPlaceholder
        : this.dict.translate(this.originalPlaceholder, lang);
      
      this.el.nativeElement.setAttribute('placeholder', translatedPlaceholder);
    }
}

  ngOnDestroy() { if (this.sub) this.sub.unsubscribe(); }
}