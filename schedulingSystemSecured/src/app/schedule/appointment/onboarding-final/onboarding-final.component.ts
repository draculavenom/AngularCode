import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SecurityService } from 'src/app/security/security.service';
import { UsersModel } from 'src/app/users/users.model';
import { UserService } from 'src/app/users/user.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding-final.component.html',
  styleUrls: ['./onboarding-final.component.css']
})
export class OnboardingFinalComponent implements OnInit {
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
    if (this.checkToken()) {
      this.router.navigate(['/']);
    }
    this.setDefault();
  }

  private checkToken(): boolean {
    let token = sessionStorage.getItem('bearerToken');
    return token !== null;
  }

  public setDefault() {
    this.user.role = "USER";
    this.userService.getManagerSelect().subscribe(list => {
      this.managerSelect = list;
    });
  }
  
public onSubmit() {
  if (this.validateForm()) {
    this.securityService.registerUser(this.user).subscribe({
      next: (data: any) => { 
        sessionStorage.setItem('bearerToken', data);
        this.updateMessage("Successful");
        setTimeout(() => {
          location.reload();
        }, 1500);
      },
      error: (error: any) => { 
        const errorMsg = Array.isArray(error.error) ? error.error : [error.error || "Error"];
        this.errorMessages(errorMsg);
      }
    });
  }
}

  public validateForm(): boolean {
    let ans = true;
    let messages = [];

    if (!this.user.firstName) { ans = false; messages.push("The first name is required."); }
    if (!this.user.lastName) { ans = false; messages.push("The last name is required."); }
    if (!this.user.email) { ans = false; messages.push("The email is required."); }
    if (!this.user.phoneNumber) { ans = false; messages.push("The phone number is required."); }
    if (!this.user.managedBy || this.user.managedBy === 0) { 
      ans = false; 
      messages.push("You must select a company."); 
    }

    if (!ans) this.errorMessages(messages);
    return ans;
  }

  public updateMessage(input: string) {
    this.messages = ["¡Registration " + input + "!"];
    this.messageType = "success";
  }

  public errorMessages(input: string[]) {
    this.messages = input;
    this.messageType = "danger";
  }
}