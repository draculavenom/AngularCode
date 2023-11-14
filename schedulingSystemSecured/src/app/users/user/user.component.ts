import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { UsersModel } from '../users.model';
import { SecurityService } from 'src/app/security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from 'src/app/layout/password-dialog/password-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UsersModel = new UsersModel(0, "", false);
  self: UsersModel = new UsersModel(0, "", false);
  message: string = "";
  messageType: string = "";
  tokenId: number = 0;

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute, 
    private securityService: SecurityService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getTokenId();
  }

  public getTokenId(){
    let token = sessionStorage.getItem('bearerToken');
    let tokenInfo: any = {};
    if (token !== null){
      tokenInfo = this.securityService.getDecodedAccessToken(token);
      this.userService.getUser().subscribe(u => this.self = u);
      this.tokenId = tokenInfo.jti;
    }
  }

  public getUser(){
    this.route.params.subscribe(params => {
      if(params['id'] !== null && params['id'] !== undefined)
        this.userService.getUserById(parseInt(params['id']!)).subscribe(u => this.user = u);
    });
  }

  public editSelf(){
    this.userService.updateSelf(this.user).subscribe(u => {
      this.user = u;
      this.updateMessage("updated");
    }, error => this.errorMessage(error.message));
  }

  public editUser(){
    this.userService.updateUser(this.user).subscribe(u => {
      this.user = u;
      this.updateMessage("updated");
    }, error => this.errorMessage(error.message));
  }

  public createUser(){
    this.userService.createUser(this.user).subscribe(u => {
      this.user = u;
      this.updateMessage("created");
    }, error => this.errorMessage(error.message));
  }

  public updateMessage(input: string){
    this.message = "User " + input + " correctly";
    this.messageType = "success";
  }

  public errorMessage(error: string){
    this.message = error;
    this.messageType = "danger";
  }

  public resetPassword(userId: number){
    this.userService.resetPassword(userId).subscribe(b => console.log(b));
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {
      data: {id: id},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetPassword(result);
    });
  }

}
