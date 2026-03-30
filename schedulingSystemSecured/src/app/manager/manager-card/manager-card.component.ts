import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ManagerProfile } from '../manager-personalization/manager-profile.model';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
    selector: 'app-manager-card',
    templateUrl: './manager-card.component.html',
    styleUrls: ['./manager-card.component.css']
})
export class ManagerCardComponent implements OnInit, OnChanges {
    @Input() managerId!: number;
    @Input() companyName?: string;
    profile?: ManagerProfile;

    constructor(private managerService: ManagerService,
        private configService: ConfigService
    ) { }

    ngOnInit(): void {
        this.checkAndLoad();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['managerId'] && changes['managerId'].currentValue) {
            this.checkAndLoad();
        }
    }

    private checkAndLoad() {
        if (this.managerId && this.managerId > 0) {
            this.managerService.getPublicManagerProfile(this.managerId).subscribe({
                next: (data) => {
                    if (data.logo && data.logo !== 'SYSTEM_DEFAULT_CREAR_LOGO') {
                        const baseUrl = this.configService.apiUrl.replace(/\/$/, '');
                        data.logo = `${baseUrl}${data.logo}`.replace(/([^:]\/)\/+/g, "$1");
                    }
                    this.profile = data;
                },
                error: (err) => console.error('Error cargando perfil público', err)
            });
        }
    }
}