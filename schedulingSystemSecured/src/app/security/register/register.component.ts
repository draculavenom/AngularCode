import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { UsersModel } from 'src/app/users/users.model';
import { UserService } from 'src/app/users/user.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  messages: string[] = [];
  messageType = "";
  user: UsersModel = new UsersModel(0, "", true);
  managerSelect: ManagerOptionsModel[] = [];
  showPassword = false;

  constructor(
      private securityService: SecurityService, 
      private userService: UserService, 
      private router: Router
    ) { }

  ngOnInit(): void {
    this.setDefault();
    if(this.checkToken())
      this.router.navigate(['/']);
  }

  private checkToken(){
    let token = sessionStorage.getItem('bearerToken');
    return token !== null;
  }

  public setDefault(){
    this.user.role = "USER";
    this.userService.getManagerSelect().subscribe(l => {
      this.managerSelect = l;
      if(l.length > 0){
        this.user.managedBy = l[0].managerId;
      } else {
      this.user.managedBy = 0;
    }
    });
  }

  public onSubmit(){
    if(this.validateForm()){
      this.securityService.registerUser(this.user).subscribe(
        data => {
          sessionStorage.setItem('bearerToken', data);
          this.updateMessage("Authetication successful.");
          location.reload();
        },
        error => this.errorMessages(error.error)
      );
    }
  }

  public validateForm(): boolean{
    let ans = true;
    let messages = [];
    if(this.user.firstName == ""){
      ans = false;
      messages.push("The First Name can't be empty. ");
    }
    if(this.user.lastName == ""){
      ans = false;
      messages.push("The Last Name can't be empty. ");
    }
    if(this.user.email == ""){
      ans = false;
      messages.push("The Email can't be empty. ");
    }
    if(this.user.phoneNumber == ""){
      ans = false;
      messages.push("The Phone Number can't be empty. ");
    }
    if(this.user.managedBy == 0){
      ans = false;
      messages.push("The Managed By can't be empty. ");
    }
    if(!ans)
      this.errorMessages(messages);
    return ans;
  }

  public updateMessage(input: string){
    this.messages[0] = "Manager " + input + " correctly";
    this.messageType = "success";
  }

  public errorMessages(input: string[]){
    this.messages = input;
    this.messageType = "danger";
  }

  public errorMessage(error: string){
    this.messages[0] = error;
    this.messageType = "danger";
  }

}
