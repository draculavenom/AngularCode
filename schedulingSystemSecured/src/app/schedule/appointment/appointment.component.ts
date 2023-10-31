import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from './appointment.model';
import { UserService } from 'src/app/users/user.service';
import { AppointmentService } from './appointment.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointment: AppointmentModel = new AppointmentModel(0, 0, new Date(), "", "SCHEDULED");
  errorMessage = "";

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.defineAppointment();
  }

  public defineAppointment(){
    this.route.params.subscribe(params => {
      if(params['id'] !== null && params['id'] !== undefined)
        this.appointmentService.getAppointment(parseInt(params['id']!)).subscribe(a => this.convertTime(a));
      else{
        this.userService.getUser().subscribe(u => this.appointment.userId = u.id);
        this.appointment.time = this.getNextHourHalfHourFromDate();
      }
    });
  }

  public convertDate(){
    this.appointment.date = new Date(this.appointment.date.getFullYear+"/"+this.appointment.date.getMonth+"/"+this.appointment.date.getDay)
  }

  public convertTime(a: AppointmentModel){
    this.appointment = a;
    this.appointment.time = this.appointment.time.substring(0,5);
  }

  public getNextHourHalfHourFromDate(): string{
    let ans: string;
    if(this.appointment.date.getMinutes() > 30)
      ans = (this.appointment.date.getHours() + 1) + ":00";
    else
      ans = this.appointment.date.getHours() + ":30";
    return ans;
  }

  public schedule(){
    if(this.appointment.id == 0)
      this.appointmentService.createAppointment(this.appointment).subscribe(a => {
        this.appointment = a;
        this.redirectToAppointmentList();
      }, error => this.errorMessage = error.error);
    else
      this.appointmentService.updateAppointment(this.appointment).subscribe(a => {
        this.appointment = a;
        this.redirectToAppointmentList();
      }, error => this.errorMessage = error.error);
  }

  public redirectToAppointmentList(){
    this.router.navigate(['schedule']);
  }

}
