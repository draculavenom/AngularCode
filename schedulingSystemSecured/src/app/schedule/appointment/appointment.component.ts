import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from './appointment.model';
import { UserService } from 'src/app/users/user.service';
import { AppointmentService } from './appointment.service';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { SecurityService } from 'src/app/security/security.service';
import { ManagerOptionsModel } from '../../users/manager.options';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersModel } from 'src/app/users/users.model';

import { error } from '@angular/compiler/src/util';

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
  managerOptions: ManagerOptionsModel = new ManagerOptionsModel(0);

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
            this.appointmentService.getAppointment(Number(params['id'])).subscribe({
              next: (a: any) => {
                this.convertTime(a);
                this.resolvedManagerId = a.managerId || u.managedBy;
                console.log("Manager identified through appointment:", this.resolvedManagerId);
                this.loadManagerDetails(this.resolvedManagerId);
                this.loadSlots();
              },
              error: (err: any) => {
                this.errorMessage = "Error loading appointment.";
              }

            });
          } else {
            if (u.managedBy) {
              this.resolvedManagerId = u.managedBy;
              console.log("Manager identified through direct relationship:", this.resolvedManagerId);
              this.loadManagerDetails(this.resolvedManagerId);
              this.loadSlots();
            } else {
              this.errorMessage = "You don't have a manager assigned. Please contact support.";
            }
          }
        }
      });
    });
  }

  private loadManagerDetails(id: number | null) {
    if (!id) return;

    this.userService.getUserById(id).subscribe({
      next: (userFullData: UsersModel) => {
        this.managerOptions = new ManagerOptionsModel(id);
        this.managerOptions.name = `${userFullData.firstName || ''} ${userFullData.lastName || ''}`.trim();
        this.userService.getManagerSelect().subscribe({
          next: (managers: any[]) => {
            const foundSelection = managers.find(m => m.managerId === id || m.id === id);

            if (foundSelection) {
              this.managerOptions.nameCompany = foundSelection.name;
              console.log("Final data:", this.managerOptions);
            }
          },
          error: (err) => console.error("Error loading the company. ", err)
        });
      },
      error: (err) => {
        console.error("Error loading manager`s data", err);

      }
    });
  }


  public loadSlots() {
    if (!this.resolvedManagerId) return;

    this.isLoadingSlots = true;
    const dateStr = this.appointment.date.toISOString().split('T')[0];

    this.managerService.getAvailableSlots(this.resolvedManagerId, dateStr).subscribe({

      next: (slots: string[]) => {
        const now = new Date();
        const isToday = new Date(this.appointment.date).toDateString() === now.toDateString();

        let displaySlots = slots ? slots.map(s => s.substring(0, 5)) : [];

        if (isToday) {
          displaySlots = displaySlots.filter(slot => {
            const [hours, minutes] = slot.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(hours, minutes, 0, 0);
            console.log(`Comparing slot time ${slotTime} with current time ${now}`);

            return slotTime > now;
          });
        }

        if (this.appointment.id !== 0 && this.appointment.time) {
          const myCurrentTime = this.appointment.time.substring(0, 5);
          if (!displaySlots.includes(myCurrentTime)) {
            displaySlots.push(myCurrentTime);
            displaySlots.sort();
          }
          console.log("Ensured current appointment time is included in slots:", displaySlots);
        }

        this.availableSlots = displaySlots;
        this.isLoadingSlots = false;
        console.log("Available slots loaded:", this.availableSlots);
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

  public convertTime(a: any) {
    this.appointment = a;

    if (this.appointment.time) {
      this.appointment.time = this.appointment.time.substring(0, 5);
    }
    if (a.date) {
      let dateObj: Date;

      if (typeof a.date === 'string') {
        const parts = a.date.split('T')[0].split('-');
        dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else {
        dateObj = new Date(a.date);
      }

      this.appointment.date = dateObj;

    }
  }

  public getAvatarColorClass(managerId: any): string {
  const id = Number(managerId);
  if (!id || isNaN(id)) {
    return 'avatar-color-0';
  }

  const numberOfColors = 6; 
  const colorIndex = id % numberOfColors;
  
  return `avatar-color-${colorIndex}`;
}

}