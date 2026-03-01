import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { AppointmentService } from './appointment/appointment.service';
import { UsersModel } from '../users/users.model';
import { AppointmentModel } from './appointment/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from '../layout/cancel-dialog/cancel-dialog.component';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { ManagerOptionsModel } from '../users/manager.options';
import { CommentDialogComponent } from '../layout/comment-dialog/comment-dialog.component';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  user: UsersModel = new UsersModel(0, "", false);
  appointments: AppointmentModel[] = [];
  selectedDate: Date = new Date();
  managerOptions: ManagerOptionsModel = new ManagerOptionsModel(0);

  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50];

  get pagedAppointments() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.appointments.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.appointments.length / this.pageSize);
  }

  get visiblePages() {
    const total = this.totalPages;
    const current = this.currentPage;
    let start = Math.max(1, current - 4);
    let end = Math.min(total, current + 4);

    if (current <= 5) {
      end = Math.min(total, 9);
    } else if (current > total - 5) {
      start = Math.max(1, total - 8);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private dialog: MatDialog,
    private managerService: ManagerService
  ) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  public getAppointments() {
    this.userService.getUser().subscribe(u => {
      this.user = u;
      console.log(u);
      this.appointments = [];
      if (u.role == "USER") {
      this.appointmentService.getAppointments(u.id).subscribe(a => {
        this.appointments = this.sortAppointments(a);
      });
    }
    else if (u.role == "MANAGER") {
      this.appointmentService.getManagerAppointments(u.id).subscribe(a => {
      
        this.appointments = this.sortAppointments(a);
        this.appointments.forEach(appointment => {
      if (appointment.userId) { 
        this.userService.getUserById(appointment.userId).subscribe({
          next: (userData) => {
            (appointment as any).firstName = userData.firstName;
            (appointment as any).lastName = userData.lastName;
          },
          error: (err) => console.error("No se pudo cargar el nombre del usuario", err)
        });
      }
    });
      });
    }
      else if (u.role == "ADMIN") {
  this.appointmentService.getAdminAppointments().subscribe({
    next: (data: AppointmentModel[]) => {
      this.appointments = data;
      this.appointments = this.sortAppointments(data);
      console.log("Successful quote:", this.appointments);
    },
    error: (err) => {
      console.error("Error loading Admin appointments:", err);
    }
  });
}
    });
    //it will be split in two, one to retrieve the userId from the user service, the second one to get the information of the appointments
  }
  private sortAppointments(list: AppointmentModel[]): AppointmentModel[] {
  return list.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
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
    this.updateLocalList(a);
  });
}

  public confirm(appointmentId: number, comment: string) {
    this.appointmentService.confirmAppointment(appointmentId, comment).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id)
      if (app !== undefined)
        app.status = a.status
    });
  }

  public complete(appointmentId: number, comment: string) {
    this.appointmentService.completeAppointment(appointmentId, comment).subscribe(a => {
      let app = this.appointments.find(ap => ap.id == a.id)
      if (app !== undefined)
        app.status = a.status
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
      this.cancel(result.id, result.comment);
    });
  }

  public onSelect(event: Event) {
    console.log(event);
  }

}
