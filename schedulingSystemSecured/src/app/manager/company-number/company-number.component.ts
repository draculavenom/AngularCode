import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { UserService } from 'src/app/users/user.service';

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
            this.managerService.getCompanyNumber(this.selectedManagerId).subscribe({
                next: (res) => {
                    const fullNumber = res.companyNumber || '';
                    this.splitPhoneNumber(fullNumber);
                    this.loading = false;
                },
                error: (err) => {
                    console.error("Error loading number:", err);
                    this.localNumber = '';
                    this.loading = false;
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

        console.log("Enviando a la BD:", finalNumber);

        this.managerService.saveCompanyNumber(this.selectedManagerId, finalNumber).subscribe({
            next: () => {
                this.loading = false;
                this.showMessage('The number has been saved successfully.', 'alert-success');
                this.onCompanySelected();
            },
            error: (err) => {
                this.loading = false;
                this.showMessage('The number could not be saved. Please try again.', 'alert-danger');
            }
        });
    }
    private showMessage(text: string, cssClass: string) {
        this.message = text;
        this.messageClass = cssClass;
        setTimeout(() => this.message = null, 2000);
    }


}