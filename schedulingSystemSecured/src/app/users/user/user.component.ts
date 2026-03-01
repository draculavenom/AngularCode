import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { UsersModel } from '../users.model';
import { SecurityService } from 'src/app/security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from 'src/app/layout/password-dialog/password-dialog.component';
import { ManagerOptionsModel } from '../manager.options';
import { ManagerService } from 'src/app/schedule/manager/manager.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UsersModel = new UsersModel(0, "", false);
  self: UsersModel = new UsersModel(0, "", false);

  managerOptions: ManagerOptionsModel = new ManagerOptionsModel(0);
  showManagerFields: boolean = false;

  message: string = "";  
  messageType: string = "";
  tokenId: number = 0;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private dialog: MatDialog,
    private managerService: ManagerService
  ) { }

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

  public getUser() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const id = parseInt(params['id']);
        this.userService.getUserById(id).subscribe(u => {
          this.user = u;
          if (this.user.role === 'MANAGER') {
            this.managerService.getManagerFullData(id).subscribe(data => {
              if (data && data.companyName) {
                this.managerOptions.nameCompany = data.companyName;
              }
            });
          }
        });
      }
    });
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
    this.message =  input + " correctly";
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
