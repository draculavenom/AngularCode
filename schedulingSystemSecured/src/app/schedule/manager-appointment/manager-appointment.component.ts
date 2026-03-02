import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from '../appointment/appointment.model';
import { AppointmentService } from '../appointment/appointment.service';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { UserService } from 'src/app/users/user.service';
import { SecurityService } from 'src/app/security/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-appointment',
  templateUrl: './manager-appointment.component.html',
  styleUrls: ['./manager-appointment.component.css']
})
export class ManagerAppointmentComponent implements OnInit {
  appointment: AppointmentModel = new AppointmentModel(0, 0, new Date(), "", "SCHEDULED");
  managedUsers: any[] = [];
  availableSlots: string[] = [];
  isLoadingSlots = false;
  minDate = new Date().toISOString().split('T')[0];
  successMessage = "";
  errorMessage = "";

  constructor(
    private appointmentService: AppointmentService,
    private managerService: ManagerService,
    private userService: UserService,
    private router: Router,
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(currentUser => {
      this.userService.getPersonsByManager(currentUser.id).subscribe({
        next: (users) => {
          this.managedUsers = users;
        },
        error: () => this.errorMessage = "Could not load your managed users."
      });
    });
  }

  onDateChange(newDate: string) {
    this.appointment.date = new Date(newDate);
    this.loadSlots();
  }
  onUserChange() {
    this.appointment.date = new Date();
    this.appointment.time = "";
    this.availableSlots = [];
    this.successMessage = "";
    this.errorMessage = "";
  }

  loadSlots() {
    if (!this.appointment.userId || !this.appointment.date) return;

    this.isLoadingSlots = true;
    const dateStr = this.appointment.date.toISOString().split('T')[0];
    this.userService.getUser().subscribe(u => {
      this.managerService.getAvailableSlots(u.id, dateStr).subscribe({
        next: (slots) => {
          this.availableSlots = slots ? slots.map(s => s.substring(0, 5)) : [];
          this.isLoadingSlots = false;
        },
        error: () => {
          this.availableSlots = [];
          this.isLoadingSlots = false;
        }
      });
    });
  }

  schedule() {
    this.appointmentService.createAppointment(this.appointment).subscribe({
      next: () => {
        this.successMessage = "Appointment successfully created for the client.";
        setTimeout(() => this.router.navigate(['schedule']), 2000);
      },
      error: (err) => this.errorMessage = err.error || "Error creating appointment."
    });
  }
}