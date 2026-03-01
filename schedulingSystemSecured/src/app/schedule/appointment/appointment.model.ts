import { Time } from "@angular/common";

export class AppointmentModel{
    id: number;
    userId: number;
    date: Date;
    time: string;
    status: string;
    comment?: string;
    companyName?: string; 
    managerId?: number;
    firstName?: string;
    lastName?: string;


    constructor(id: number, userId: number, date: Date, time: string, status: string, comment?: string, companyName?: string, managerId?: number, firstName?: string, lastName?: string){
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.time = time;
        this.status = status;
        this.comment = comment;
        this.companyName = companyName;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}