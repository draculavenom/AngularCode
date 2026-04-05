import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { UsersModel } from '../users.model';
import { SecurityService } from 'src/app/security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from 'src/app/layout/password-dialog/password-dialog.component';
import { ManagerOptionsModel } from '../manager.options';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [NgbDatepickerConfig]
})
export class UserComponent implements OnInit {
  user: UsersModel = new UsersModel(0, "", false);
  self: UsersModel = new UsersModel(0, "", false);

  managerOptions: ManagerOptionsModel = new ManagerOptionsModel(0);
  showManagerFields: boolean = false;

  message: string = "";
  messageType: string = "";
  tokenId: number = 0;
  modelDate!: NgbDateStruct;
  activeModelDate!: NgbDateStruct;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private dialog: MatDialog,
    private managerService: ManagerService,
    private config: NgbDatepickerConfig
  ) {
    const current = new Date();
    this.config.minDate = { year: 1920, month: 1, day: 1 };
    this.config.maxDate = { year: current.getFullYear(), month: 12, day: 31 };
    this.config.navigation = 'select';
    this.config.outsideDays = 'hidden';
  }

  onDateChange(date: NgbDateStruct) {
    if (date) {
      const month = date.month;
      const day = date.day;
      this.user.dateOfBirth = new Date(date.year, month - 1, day);
    }
  }
  ngOnInit(): void {
    this.getUser();
    this.getTokenId();
  }
  public getTokenId() {
    let token = sessionStorage.getItem('bearerToken');
    let tokenInfo: any = {};
    if (token !== null) {
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      this.userService.getUser().subscribe(u => this.self = u);
      this.tokenId = tokenInfo.jti;
    }
  }
  private parseDateToPicker(dateSource: any): NgbDateStruct | null {
    if (!dateSource) return null;
    const d = new Date(dateSource);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
  }
  public getUser() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const id = parseInt(params['id']);
        this.userService.getUserById(id).subscribe(u => {
          this.user = u;
          if (this.user.dateOfBirth) {
            this.modelDate = this.parseDateToPicker(this.user.dateOfBirth)!;
          }
          if (this.user.role === 'MANAGER') {
            this.managerService.getManagerFullData(id).subscribe(data => {
              if (data && data.companyName) {
                this.managerOptions.nameCompany = data.companyName;
              }
              this.activeModelDate = this.parseDateToPicker(data.activeDate)!;
            });
          }
        });
      }
    });
  }
  onActiveDateChange(date: NgbDateStruct) {
    if (date) {
      this.managerOptions.activeDate = new Date(date.year, date.month - 1, date.day);
    }
  }
  public editSelf() {
    this.userService.updateSelf(this.user).subscribe(u => {
      this.user = u;
      this.updateMessage("updated");
    }, error => this.errorMessage(error.message));
  }

  public editUser() {
    this.userService.updateUser(this.user).subscribe({
      next: (u) => {
        this.user = u;
        if (this.user.role === 'MANAGER') {
          this.managerService.updateCompany(this.user.id, this.managerOptions).subscribe({
            next: () => {
              this.updateMessage("User and Company updated successfully");
            },
            error: (err) => this.errorMessage("User saved, but Company failed: " + err.message)
          });
        } else {
          this.updateMessage("User updated successfully");
        }
      },
      error: (err) => this.errorMessage(err.message)
    });
  }

  public createUser() {
    this.userService.createUser(this.user).subscribe(u => {
      this.user = u;
      this.updateMessage("created");
    }, error => this.errorMessage(error.message));
  }

  public updateMessage(input: string) {
    this.message = input + " correctly";
    this.messageType = "success";
  }

  public errorMessage(error: string) {
    this.message = error;
    this.messageType = "danger";
  }

  public resetPassword(userId: number) {
    this.userService.resetPassword(userId).subscribe(b => console.log(b));
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetPassword(result);
    });
  }

  public saveManagerDetails() {
    if (this.user.id !== 0) {
      this.managerOptions.managerId = this.user.id;
      this.managerOptions.adminId = this.tokenId;

      this.managerService.createManagerOptions(this.managerOptions).subscribe(m => {
        this.managerOptions = m;
        this.message = "Manager details and company updated successfully";
        this.messageType = "success";
        this.showManagerFields = false;
      }, error => this.errorMessage(error.message));
    } else {
      this.errorMessage("You must create the user first.");
    }
  }
}
