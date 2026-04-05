import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

const I18N_VALUES: any = {
    'es': {
        weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
        months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        fullMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    },
    'en': {
        weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        fullMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
};

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    constructor(private translate: TranslateService) {
        super();
    }

    getWeekdayLabel(weekday: number): string {
        const lang = this.translate.currentLang || 'en';
        return I18N_VALUES[lang].weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        const lang = this.translate.currentLang || 'en';
        return I18N_VALUES[lang].months[month - 1];
    }
    getMonthFullName(month: number): string {
        const lang = this.translate.currentLang || 'en';
        return I18N_VALUES[lang].fullMonths[month - 1];
    }
    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}