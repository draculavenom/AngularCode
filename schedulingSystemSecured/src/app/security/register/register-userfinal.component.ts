import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service'; 
import { UsersModel } from 'src/app/users/users.model';
import { UserService } from 'src/app/users/user.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-userfinal.component.html',
  styleUrls: ['./register-userfinal.component.css']
})
export class RegisterUserFinalComponent implements OnInit {
  messages: string[] = [];
  messageType = "";
  user: UsersModel = new UsersModel(0, "", true);
  managerSelect: ManagerOptionsModel[] = [];

  constructor(
    private securityService: SecurityService, 
    private userService: UserService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user.role = "USER";
    this.userService.getManagerSelect().subscribe((l: any) => {
      this.managerSelect = l;
    });
  }

  public onSubmit() {
    this.securityService.registerUser(this.user).subscribe({
      next: (data: any) => {
        sessionStorage.setItem('bearerToken', data);
        this.securityService.updateAuthStatus(true);
        this.messageType = "success";
        this.messages = ["Please, now select the date and time for your first appointment."];
        setTimeout(() => {
          this.router.navigate(['/schedule/appointment']);
        }, 1500);
      },
      error: (err: any) => {
        this.messageType = "danger";
        this.messages = Array.isArray(err.error) ? err.error : [err.error || "Error"];
      }
    });
  }
}