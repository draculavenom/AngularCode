import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { UserService } from 'src/app/users/user.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-company-number',
    templateUrl: './company-number.component.html',
    styleUrls: ['./company-number.component.css']
})
export class CompanyNumberComponent implements OnInit {
    companies: any[] = [];
    selectedManagerId: number | null = null;

    countries = [
        { name: 'México', code: '52', flag: '🇲🇽', len: 10 },
        { name: 'Colombia', code: '57', flag: '🇨🇴', len: 10 },
        { name: 'España', code: '34', flag: '🇪🇸', len: 9 },
        { name: 'Argentina', code: '54', flag: '🇦🇷', len: 11 },
        { name: 'Perú', code: '51', flag: '🇵🇪', len: 9 },
        { name: 'USA', code: '1', flag: '🇺🇸', len: 10 }
    ];
    selectedPrefix: string = '52';
    localNumber: string = '';
    message: string | null = null;
    messageClass: string = '';
    loading: boolean = false;
    accessToken: string = '';
    phoneNumberId: string = ''; 
    wabaId: string = '';        
    verifyToken: string = '';   

    get selectedCountry() {
        return this.countries.find(c => c.code === this.selectedPrefix);
    }

    isNumberValid(): boolean {
        const country = this.selectedCountry;
        if (!country) return false;

        const cleanNumber = this.localNumber.replace(/\s+/g, '');
        return cleanNumber.length === country.len;
    }

    formatNumber() {
        this.localNumber = this.localNumber.replace(/[^0-9]/g, '');
    }
    constructor(
        private managerService: ManagerService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.managerService.getManagerNameSelect().subscribe({
            next: (data) => {
                this.companies = data;
            },
            error: (err) => console.error("Error loading companies", err)
        });
    }

  onCompanySelected() {
    if (this.selectedManagerId) {
        this.loading = true;
        forkJoin({
            telefono: this.managerService.getCompanyNumber(this.selectedManagerId),
            configWhatsapp: this.managerService.getFullWhatsappConfig(this.selectedManagerId)
        }).subscribe({
            next: (res) => {
                if (res.telefono && res.telefono.companyNumber) {
                    this.splitPhoneNumber(res.telefono.companyNumber);
                } else {
                    this.localNumber = '';
                }
                if (res.configWhatsapp) {
                    this.accessToken = res.configWhatsapp.accessToken || '';
                    this.phoneNumberId = res.configWhatsapp.phoneNumberId || '';
                    this.wabaId = res.configWhatsapp.wabaId || '';
                    this.verifyToken = res.configWhatsapp.verifyToken || '';
                    this.loading = false;
                }
            },
            error: (err) => {
                this.loading = false;
                this.localNumber = '';
                this.accessToken = '';
                this.phoneNumberId = '';
                this.wabaId = '';
                this.verifyToken = '';
            }
        });
    }
}

    private splitPhoneNumber(fullNumber: string) {
        const sortedCountries = [...this.countries].sort((a, b) => b.code.length - a.code.length);

        const found = sortedCountries.find(c => fullNumber.startsWith(c.code));

        if (found) {
            this.selectedPrefix = found.code;
            this.localNumber = fullNumber.substring(found.code.length);
        } else {
            this.selectedPrefix = '52';
            this.localNumber = fullNumber;
        }
    }
    onlyNumbers(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    onPrefixChange() {
        if (this.localNumber && this.selectedCountry) {
            if (this.localNumber.length > this.selectedCountry.len) {
                this.localNumber = this.localNumber.substring(0, this.selectedCountry.len);
            }
        }
    }
    save() {
        if (!this.selectedManagerId || !this.localNumber) {
            this.showMessage("Please select a manager and enter a number.", 'alert-danger');
            return;
        }

        if (!this.isNumberValid()) {
            this.showMessage(`The number for ${this.selectedCountry?.name} must have ${this.selectedCountry?.len} dígitos.`, 'alert-danger');
            return;
        }
        this.loading = true;
        const cleanLocalNumber = this.localNumber.replace(/\s+/g, '');
        const finalNumber = `${this.selectedPrefix}${cleanLocalNumber}`;
        const config = {
            phoneNumberId: this.phoneNumberId, 
            accessToken: this.accessToken,
            wabaId: this.wabaId,
            verifyToken: this.verifyToken,
        };

        forkJoin({
        number: this.managerService.saveCompanyNumber(this.selectedManagerId, finalNumber),
        config: this.managerService.saveFullWhatsappConfig(this.selectedManagerId, config)
    }).subscribe({
        next: (res) => {
            this.loading = false;
            this.showMessage('Number and settings saved successfully!', 'alert-success');
        },
        error: (err) => {
            this.loading = false;
            this.showMessage('Error saving changes. ', 'alert-danger');
        }
    });
    }
    private showMessage(text: string, cssClass: string) {
        this.message = text;
        this.messageClass = cssClass;
        setTimeout(() => this.message = null, 2000);
    }
}