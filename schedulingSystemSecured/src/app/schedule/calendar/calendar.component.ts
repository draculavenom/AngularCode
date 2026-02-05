import { Component, OnInit } from '@angular/core'
import { UserService } from '../../users/user.service';
import { AppointmentService } from '../appointment/appointment.service';
import { UsersModel } from '../../users/users.model';
import { AppointmentModel } from '../appointment/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from '../../layout/cancel-dialog/cancel-dialog.component';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { ManagerOptionsModel } from '../../users/manager.options';
import { DatePipe } from '@angular/common';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})

export class CalendarComponent implements OnInit {
  @ViewChild('calendar') _calendar!: MatCalendar<Date>;
  user: UsersModel = new UsersModel(0, "", false);
  allAppointments: AppointmentModel[] = [];
  appointments: AppointmentModel[] = [];
  selectedDate: Date | null = new Date();
  managerOptions: ManagerOptionsModel = new ManagerOptionsModel(0);
  currentPage: number = 1;

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private dialog: MatDialog,
    private managerService: ManagerService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAppointments();
  }
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month' && this.allAppointments.length > 0) {
      const cellDateStr = this.datePipe.transform(cellDate, 'yyyy-MM-dd');
      const dayApps = this.allAppointments.filter(appo =>
        appo.date && String(appo.date).split('T')[0] === cellDateStr
      );
      if (dayApps.length > 0) {
        // Colores según el estado de las citas
        if (dayApps.some(a => a.status === 'CONFIRMED')) return 'date-has-confirmed';
        if (dayApps.some(a => a.status === 'SCHEDULED')) return 'date-has-scheduled';
        if (dayApps.some(a => a.status === 'CANCELLED')) return 'date-has-cancelled';
        if (dayApps.some(a => a.status === 'COMPLETED')) return 'date-has-completed';
        return 'date-has-past';
      }
    }
    return '';
  };

  public getAppointments() {
    this.userService.getUser().subscribe(u => {
      this.user = u;
      const handleResponse = (data: AppointmentModel[]) => {
        this.allAppointments = data || [];
        this.applyFilter();
        this.cdr.detectChanges();
        if (this._calendar) {
          this._calendar.updateTodaysDate();
        }
      };

      if (u.role === "USER") {
        this.appointmentService.getAppointments(u.id).subscribe(handleResponse);
      } else if (u.role === "MANAGER") {
        this.appointmentService.getManagerAppointments(u.id).subscribe(handleResponse);
      } else if (u.role === "ADMIN") {
        this.appointmentService.getAdminAppointments().subscribe(handleResponse);
      }
    });
  }

  public applyFilter() {
    const targetDate = this.datePipe.transform(this.selectedDate || new Date(), 'yyyy-MM-dd');
    this.appointments = this.allAppointments.filter(appo => {
      if (!appo.date) return false;
      const appoDateStr = String(appo.date).split('T')[0];
      return appoDateStr === targetDate;
    });

    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  public onDateChange(date: Date | null) {
    this.selectedDate = date;
    this.applyFilter();
  }

  public resetFilter() {
    this.selectedDate = new Date();
    this.applyFilter();
    if (this._calendar) {
      this._calendar.activeDate = this.selectedDate;
    }
  }

  public cancel(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id)
      if (app !== undefined)
        app.status = a.status
    });
  }

  public confirm(appointmentId: number) {
    this.appointmentService.confirmAppointment(appointmentId).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id)
      if (app !== undefined)
        app.status = a.status
    });
  }

  public complete(appointmentId: number) {
    this.appointmentService.completeAppointment(appointmentId).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id)
      if (app !== undefined)
        app.status = a.status
    });
  }

  openDialog(appointmentId: number): void {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      data: { id: appointmentId },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cancel(result);
    });
  }

  public onSelect(event: Event) {
    console.log(event);
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'CONFIRMED': return '#28a745';
      case 'SCHEDULED': return '#0066ffff';
      case 'CANCELLED': return '#dc3545';
      case 'COMPLETED': return '#176ab8ff';
      default: return '#6c757d';
    }
  }

  handleEventClick(info: any) {
    const appointmentId = info.event.id;
    console.log('Cita seleccionada:', info.event.extendedProps);
  }

}
