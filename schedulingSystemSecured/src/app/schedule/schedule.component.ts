import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { AppointmentService } from './appointment/appointment.service';
import { UsersModel } from '../users/users.model';
import { AppointmentModel } from './appointment/appointment.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  user: UsersModel = new UsersModel(0,"",false);
  appointments: AppointmentModel[] = [];

  constructor(private appointmentService: AppointmentService, private userService: UserService) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  public getAppointments(){
    this.userService.getUser().subscribe(u => {
      this.appointmentService.getAppointments(u.id).subscribe(a => a.forEach(ap => this.appointments.push(ap)));
    });
    
    //it will be split in two, one to retrieve the userId from the user service, the second one to get the information of the appointments
  }

}
