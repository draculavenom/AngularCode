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
import { CommentDialogComponent } from '../../layout/comment-dialog/comment-dialog.component';


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

      let request;
      if (u.role === "USER") {
        request = this.appointmentService.getAppointments(u.id);
      } else if (u.role === "MANAGER") {
        request = this.appointmentService.getManagerAppointments(u.id);
      } else if (u.role === "ADMIN") {
        request = this.appointmentService.getAdminAppointments();
      }
      if (request) {
        request.subscribe(data => {
          this.allAppointments = data || [];
          this.applyFilter();

          if (u.role === "ADMIN" || u.role === "MANAGER") {
            this.fillUserNames();
          }
          if (this._calendar) {
            this._calendar.updateTodaysDate();
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  private fillUserNames() {
    this.allAppointments.forEach(appo => {
      if (appo.userId) {
        this.userService.getUserById(appo.userId).subscribe({
          next: (userData) => {
            (appo as any).firstName = userData.firstName;
            (appo as any).lastName = userData.lastName;

            this.cdr.detectChanges();
          },
          error: (err) => console.error("Error al obtener usuario:", err)
        });
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

  openActionDialog(appointmentId: number, status: string): void {
    const isCancel = status === 'CANCELLED';
    const isConfirm = status === 'CONFIRMED';
    const isComplete = status === 'COMPLETED';

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: {
        title: isCancel ? 'Cancel Appointment' : (isConfirm ? 'Confirm Appointment' : 'Complete Appointment'),
        message: `Are you sure you want to ${status.toLowerCase()} this appointment?`,
        isMandatory: isCancel // Solo obligatorio si es cancelación
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(comment => {
      if (comment !== undefined) {
        if (isCancel) {
          this.cancel(appointmentId, comment);
        } else {
          this.updateStatus(appointmentId, status, comment);
        }
      }
    });
  }


  public cancel(appointmentId: number, comment: string) {
    this.appointmentService.cancelAppointment(appointmentId, comment).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id)
      if (app !== undefined)
        app.status = a.status
    });
  }



  public confirm(appointmentId: number, comment: string = "Confirmed via Calendar") {
    this.appointmentService.confirmAppointment(appointmentId, comment).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id);
      if (app !== undefined) app.status = a.status;
      this.cdr.detectChanges();
    });
  }

  public complete(appointmentId: number, comment: string = "Completed via Calendar") {
    this.appointmentService.completeAppointment(appointmentId, comment).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id);
      if (app !== undefined) app.status = a.status;
      this.cdr.detectChanges();
    });
  }

  public updateStatus(appointmentId: number, status: string, comment: string) {
    const payload = { id: appointmentId, status: status, comment: comment };
    this.appointmentService.updateStatus(payload).subscribe(a => {
      this.updateLocalList(a);
    });
  }
  private updateLocalList(updatedApp: any) {
    let app = this.appointments.find(ap => ap.id == updatedApp.id);
    if (app) {
      app.status = updatedApp.status;
      app.comment = updatedApp.comment;
    }
  }

  openDialog(appointmentId: number): void {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      data: { id: appointmentId },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.id) {
        this.cancel(result.id, result.comment || "Cancelled by manager");
      }
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
