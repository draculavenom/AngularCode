import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { AppointmentService } from '../appointment/appointment.service';
import { AppointmentModel } from '../appointment/appointment.model';
import { UserService } from 'src/app/users/user.service';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-appointment-quick-slot',
  templateUrl: './appointment-quick-slot.component.html',
  styleUrls: ['./appointment-quick-slot.component.css']
})
export class AppointmentQuickSlotComponent implements OnInit {
  quickSlot: { date: Date, time: string } | null = null;
  isLoading = true;
  isSaving = false;
  userData: any = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private managerService: ManagerService,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.userData = user;
      if (user && user.managedBy) {
        this.findNextAvailable(user.managedBy, new Date(), 0);
      }
    });
  }

  loadInitialData() {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.userData = user;
        if (user.managedBy) {
          this.findNextAvailable(user.managedBy, new Date(), 0);
        }
      }
    });
  }

  private findNextAvailable(managerId: number, date: Date, attempts: number) {
    if (attempts > 14) {
      console.warn("The 14-day search limit has been reached. No available slots found.");
      this.isLoading = false;
      return;
    }

    const dateStr = date.toISOString().split('T')[0];
    const now = new Date();
    console.log(` Evaluating day: ${dateStr} (Day of the week: ${now.getDay()}) - Attempt: ${attempts}`);
    forkJoin({
      slots: this.managerService.getAvailableSlots(managerId, dateStr),
      userAppointments: this.appointmentService.getAppointments(this.userData.id).pipe(
        catchError(() => of([] as AppointmentModel[]))
      )
    }).subscribe({
      next: ({ slots, userAppointments }: { slots: string[], userAppointments: AppointmentModel[] }) => {
        console.log(`Manager Schedule Configuration:`);
        if (!slots || slots.length === 0) {
          console.log(`Day ${dateStr} has no slots available from manager.`);
          return this.jumpToNextDay(managerId, date, attempts);
        }
        const validSlots = slots.filter(slot => {
          const timeShort = slot.substring(0, 5);


          const isAlreadyBookedByMe = userAppointments.some(app => {
            const appDate = new Date(app.date).toISOString().split('T')[0];
            const appTime = app.time.substring(0, 5);
            return appDate === dateStr && appTime === timeShort && app.status !== 'CANCELLED';
          });

          const [hours, minutes] = timeShort.split(':').map(Number);
          const slotDT = new Date(date);
          slotDT.setHours(hours, minutes, 0);
          const isFuture = slotDT.getTime() > (now.getTime() + 15 * 60000);

          return !isAlreadyBookedByMe && isFuture;
        });
        console.log(`Final available slots for ${dateStr}:`, validSlots);

        if (validSlots.length > 0) {
          console.log(` Suggested appointment found!: ${dateStr} at ${validSlots[0]}`);
          this.quickSlot = { date: new Date(date), time: validSlots[0].substring(0, 5) };
          this.isLoading = false;
        } else {
          console.log(`No available slots on ${dateStr}, skipping to next day...`);
          this.jumpToNextDay(managerId, date, attempts);
        }
      },
      error: (err) => {
        console.error("Error fetching data:", err);
        this.isLoading = false;
      }
    });
  }

  private jumpToNextDay(managerId: number, date: Date, attempts: number) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.findNextAvailable(managerId, tomorrow, attempts + 1);
  }

  confirmAppointment() {
    if (!this.quickSlot || !this.userData) return;

    this.isSaving = true;

    const newApp = new AppointmentModel(
      0,
      this.userData.id,
      this.quickSlot.date,
      this.quickSlot.time,
      "SCHEDULED"
    );

    this.appointmentService.createAppointment(newApp).subscribe({
      next: () => {

        this.successMessage = ' Appointment successfully confirmed! Redirecting to schedule...';
        setTimeout(() => {
          this.isSaving = false;
          this.router.navigate(['/schedule']);
        }, 4000);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Error saving. The date may already be in use. Please try again.';
      }
    });
  }
}