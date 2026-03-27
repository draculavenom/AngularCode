import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LegalService } from '../../services/legal.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-legal-page',
  templateUrl: './legal-page.component.html',
  styleUrls: ['./legal-page.component.css']
})
export class LegalPageComponent implements OnInit {
  legalData: any;
  currentType: string = '';

  constructor(
    private route: ActivatedRoute,
    private legalService: LegalService,
    private translate: TranslateService
  ) {}

 ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.currentType = data['type'];
      this.loadContent();
    });

    this.translate.onLangChange.subscribe(() => {
      this.loadContent();
    });
  }
  private loadContent(): void {
    if (!this.currentType) return;
    this.legalService.getLegalContent(this.currentType).subscribe(res => {
      this.legalData = res;
    });
  }
}