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
  minDate: string = new Date().toISOString().split('T')[0];
  existingAppointments: AppointmentModel[] = [];
  public successMessage: string = '';
  
    allTimes: string[] = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.defineAppointment();
  }


 public defineAppointment() {
    this.route.params.subscribe(params => {
      this.userService.getUser().subscribe(u => {
        this.appointment.userId = u.id;
        this.appointmentService.getAppointments(u.id).subscribe(list => {
          this.existingAppointments = list;
        });

        if (params['id'] !== null && params['id'] !== undefined) {
          this.appointmentService.getAppointment(parseInt(params['id']!)).subscribe(a => this.convertTime(a));
        } else {
          this.appointment.time = this.getNextHourHalfHourFromDate();
        }
      });
    });
  }
  get filteredTimes(): string[] {
    const selectedDateStr = new Date(this.appointment.date).toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    
    let times = this.allTimes;

    if (selectedDateStr === todayStr) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      times = times.filter(t => t > currentTime);
    }

    return times.filter(t => {
      const isOccupied = this.existingAppointments.some(ap => {
        const apDate = new Date(ap.date).toISOString().split('T')[0];
        const apTime = ap.time.substring(0, 5);
        
        return apDate === selectedDateStr && 
               apTime === t && 
               ap.id !== this.appointment.id &&
             ap.status !== 'CANCELLED';
      });
      return !isOccupied;
    });
  }

  public convertDate(){
    this.appointment.date = new Date(this.appointment.date.getFullYear+"/"+this.appointment.date.getMonth+"/"+this.appointment.date.getDay)
  }

  public convertTime(a: AppointmentModel) {
    this.appointment = a;
    const dateStr = String(a.date); 

    if (dateStr) {
        const cleanDate = dateStr.split('T')[0];
        const parts = cleanDate.split('-');
        
        if (parts.length === 3) {
            this.appointment.date = new Date(
                parseInt(parts[0]), 
                parseInt(parts[1]) - 1, 
                parseInt(parts[2])
            );
        }
    }

    if (this.appointment.time) {
        this.appointment.time = this.appointment.time.substring(0, 5);
    }
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
        //this.redirectToAppointmentList();
         this.successMessage = 'Appointment created successfully.';setTimeout(() => {
        this.redirectToAppointmentList();
      }, 2000);
         
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
