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
  private managerId: number | null = null;
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
      this.managerId = currentUser.id;
      this.userService.getPersonsByManager(currentUser.id).subscribe({
        next: (users) => this.managedUsers = users,
        error: () => this.errorMessage = "Could not load your managed users."
      });
    });
  }

  onDateChange(newDate: string) {
    const [y, m, d] = newDate.split('-').map(Number);
    this.appointment.date = new Date(y, m - 1, d);
    this.loadSlots();
  }
  onUserChange() {
    this.appointment.date = new Date();
    this.appointment.time = "";
    this.availableSlots = [];
    this.successMessage = "";
    this.errorMessage = "";
    if (this.appointment.date) {
      this.loadSlots();
    }
  }

  loadSlots() {
    if (!this.appointment.userId || !this.appointment.date || !this.managerId) return;

    this.isLoadingSlots = true;
    const dateStr = this.appointment.date.toISOString().split('T')[0];
    this.managerService.getAvailableSlots(this.managerId, dateStr).subscribe({
      next: (slots: string[]) => {
        const now = new Date();
        const selectedDate = new Date(this.appointment.date);

        const isToday = selectedDate.toDateString() === now.toDateString();

        if (isToday) {
          this.availableSlots = slots.filter(slot => {
            const [hours, minutes] = slot.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(hours, minutes, 0, 0);

            return slotTime > now;
          }).map(s => s.substring(0, 5));
        } else {
          this.availableSlots = slots ? slots.map(s => s.substring(0, 5)) : [];
        }
        this.isLoadingSlots = false;
      },
      error: () => {
        this.availableSlots = [];
        this.isLoadingSlots = false;
        this.errorMessage = "Could not load available slots for the selected date. Please try again later.";
      }
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