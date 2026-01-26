import { Time } from "@angular/common";

export class AppointmentModel{
    id: number;
    userId: number;
    date: Date;
    time: string;
    status: string;
    companyName?: string; 
    managerId?: number;


    constructor(id: number, userId: number, date: Date, time: string, status: string, companyName?: string, managerId?: number){
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.time = time;
        this.status = status;
        this.companyName = companyName;
    }
}