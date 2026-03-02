import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LegalService } from '../../services/legal.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-legal-page',
  templateUrl: './legal-page.component.html',
  styleUrls: ['./legal-page.component.css']
})
export class LegalPageComponent implements OnInit {
  legalData: any;

  constructor(
    private route: ActivatedRoute,
    private legalService: LegalService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const type = data['type'];
      this.legalService.getLegalContent(type).subscribe(res => {
        this.legalData = res;
      });
    });
  }
}