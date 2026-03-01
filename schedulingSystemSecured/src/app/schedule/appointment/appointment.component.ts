import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from './appointment.model';
import { UserService } from 'src/app/users/user.service';
import { AppointmentService } from './appointment.service';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { SecurityService } from 'src/app/security/security.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointment: AppointmentModel = new AppointmentModel(0, 0, new Date(), "", "SCHEDULED");

  errorMessage = "";
  successMessage = "";
  isLoadingSlots = false;
  minDate: string = new Date().toISOString().split('T')[0];

  availableSlots: string[] = [];
  managersList: any[] = [];
  resolvedManagerId: number | null = null;

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private managerService: ManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.defineAppointment();
  }

  public defineAppointment() {
    this.route.params.subscribe(params => {
      this.userService.getUser().subscribe({
        next: (u: any) => {
          this.appointment.userId = u.id;

          if (params['id']) {
            this.appointmentService.getAppointment(Number(params['id'])).subscribe(a => {
              this.convertTime(a);
              this.resolvedManagerId = (a as any).managerId;
              this.loadSlots();
            });
          } else {
            if (u.managedBy) {
              this.resolvedManagerId = u.managedBy;
              console.log("Manager identified through direct relationship:", this.resolvedManagerId);
              this.loadSlots();
            } else {
              this.errorMessage = "You don't have a manager assigned. Please contact support.";
            }
          }
        }
      });
    });
  }

  public loadSlots() {
    if (!this.resolvedManagerId) return;

    this.isLoadingSlots = true;
    const dateStr = this.appointment.date.toISOString().split('T')[0];

    this.managerService.getAvailableSlots(this.resolvedManagerId, dateStr).subscribe({
      next: (slots) => {
        this.availableSlots = slots ? slots.map(s => s.substring(0, 5)) : [];
        this.isLoadingSlots = false;
      },
      error: () => {
        this.availableSlots = [];
        this.isLoadingSlots = false;
      }
    });
  }



  public onDateChange(newDateValue: string) {
    if (newDateValue) {
      const parts = newDateValue.split('-');
      this.appointment.date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
      this.loadSlots();
    }
  }

  public schedule() {
    if (!this.appointment.time) {
      this.errorMessage = "Please select a schedule.";
      return;
    }

    const serviceCall = this.appointment.id === 0
      ? this.appointmentService.createAppointment(this.appointment)
      : this.appointmentService.updateAppointment(this.appointment);

    serviceCall.subscribe({
      next: () => {
        this.successMessage = 'Appointment saved successfully.';
        setTimeout(() => {
        // Solo redirigir si el usuario no se ha ido ya a la página de promo
        if (this.router.url.includes('appointment')) { 
           this.router.navigate(['schedule']);
        }
      }, 6000);
    },
      error: (err) => this.errorMessage = err.error || "Error saving appointment"
    });
  }

  public convertTime(a: AppointmentModel) {
    this.appointment = a;
    if (this.appointment.time) this.appointment.time = this.appointment.time.substring(0, 5);
    if (typeof a.date === 'string') {
      const parts = (a.date as string).split('T')[0].split('-');
      this.appointment.date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
  }
}