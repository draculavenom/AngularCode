import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { AppointmentService } from './appointment/appointment.service';
import { UsersModel } from '../users/users.model';
import { AppointmentModel } from './appointment/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from '../layout/cancel-dialog/cancel-dialog.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  user: UsersModel = new UsersModel(0,"",false);
  appointments: AppointmentModel[] = [];

  constructor(
    private appointmentService: AppointmentService, 
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  public getAppointments(){
    this.userService.getUser().subscribe(u => {
      this.user = u;
      console.log(u);
      if(u.role == "USER")
        this.appointmentService.getAppointments(u.id).subscribe(a => a.forEach(ap => this.appointments.push(ap)));
      else if(u.role == "USER")
        this.appointmentService.getManagerAppointments(u.id).subscribe(a => a.forEach(ap => this.appointments.push(ap)));
    });
    
    //it will be split in two, one to retrieve the userId from the user service, the second one to get the information of the appointments
  }

  public cancel(appointmentId: number){
    this.appointmentService.cancelAppointment(appointmentId).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id)
      if(app !== undefined)
        app.status = a.status
    });
  }

  openDialog(appointmentId: number): void {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      data: {id: appointmentId},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cancel(result);
    });
  }

}
