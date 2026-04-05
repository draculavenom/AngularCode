import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from '../appointment/appointment.model';
import { AppointmentService } from '../appointment/appointment.service';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { UserService } from 'src/app/users/user.service';
import { SecurityService } from 'src/app/security/security.service';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manager-appointment',
  templateUrl: './manager-appointment.component.html',
  styleUrls: ['./manager-appointment.component.css'],
  providers: [NgbDatepickerConfig]
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
  serviceModelDate!: NgbDateStruct;

  constructor(
    private appointmentService: AppointmentService,
    private managerService: ManagerService,
    private userService: UserService,
    private router: Router,
    private securityService: SecurityService,
    private config: NgbDatepickerConfig
  ) {
    const current = new Date();
    this.config.minDate = { year: 1920, month: 1, day: 1 };
    this.config.maxDate = { year: current.getFullYear(), month: 12, day: 31 };
    this.config.navigation = 'select';
    this.config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    const today = new Date();
    this.serviceModelDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.userService.getUser().subscribe(currentUser => {
      this.managerId = currentUser.id;
      this.userService.getPersonsByManager(currentUser.id).subscribe({
        next: (users) => this.managedUsers = users,
        error: () => this.errorMessage = "Could not load your managed users."
      });
    });
  }
  onServiceDateSelect(date: NgbDateStruct) {
    if (date) {
      this.appointment.date = new Date(date.year, date.month - 1, date.day);
      this.loadSlots();
    }
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