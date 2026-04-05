import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UsersModel } from '../users.model';
import { ManagerOptionsModel } from '../manager.options';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrls: ['./manager-user.component.css'],
  providers: [NgbDatepickerConfig]
})
export class ManagerUserComponent implements OnInit {
  userManager: UsersModel = new UsersModel(0, "", true);
  managerOptions: ManagerOptionsModel = new ManagerOptionsModel(0);
  messages: string[] = [];
  messageType = "";
  companyName: string = "";
  modelDate!: NgbDateStruct;
  activeModelDate!: NgbDateStruct;

  constructor(private userService: UserService, private managerService: ManagerService,
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
      this.userManager.dateOfBirth = new Date(date.year, month - 1, day);
    }
  }

  onActiveDateChange(date: NgbDateStruct) {
    if (date) {
      this.managerOptions.activeDate = new Date(date.year, date.month - 1, date.day);
    }
  }

  ngOnInit(): void {
    this.defaultValues();
  }

  public defaultValues() {
    this.userService.getUser().subscribe(u => {
      this.userManager.managedBy = u.id;
      this.managerOptions.adminId = u.id;
    });
    this.userManager.role = "MANAGER";
    this.userManager.password = "password";//456123 check what should be the password by default and create a method for the user to change it first time he logs in.
  }

  public createUser() {
    if (this.validateForm()) {
      this.userService.createUser(this.userManager).subscribe(u => {
        this.userManager = u;
        const managerData: any = {
          managerId: u.id,
          adminId: this.managerOptions.adminId,
          ammountPaid: this.managerOptions.ammountPaid,
          activeDate: this.managerOptions.activeDate,
          comments: this.managerOptions.comments,
          companyName: this.companyName
        };
        this.managerService.createManagerOptions(managerData).subscribe(m => {
          this.updateMessage("created");
        }, error => this.errorMessage("Error in ManagerOptions: " + error.message));

      }, error => this.errorMessage("Error in User: " + error.message));
    }
  }

  public validateForm(): boolean {
    let ans = true;
    let messages: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(this.managerOptions.activeDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (this.userManager.firstName == "") {
      ans = false;
      messages.push("The First Name can't be empty. ");
    }
    if (this.userManager.lastName == "") {
      ans = false;
      messages.push("The Last Name can't be empty. ");
    }
    if (this.userManager.email == "") {
      ans = false;
      messages.push("The Email can't be empty. ");
    }
    if (this.userManager.phoneNumber == "") {
      ans = false;
      messages.push("The Phone Number can't be empty. ");
    }
    if (this.userManager.managedBy == 0) {
      ans = false;
      messages.push("The Managed By can't be empty. ");
    }
    if (this.managerOptions.ammountPaid == 0) {
      ans = false;
      messages.push("The Ammount paid can't be 0. ");
    }
    if (this.managerOptions.ammountPaid < 0) {
      ans = false;
      messages.push("The Ammount paid can't be negative. ");
    }
    if (this.managerOptions.activeDate.toString() == "") {
      ans = false;
      messages.push("The Active Until can't be empty. ");
    } else if (selectedDate < today) {
      ans = false;
      messages.push("The Active Until can't be in the past. ");
    }
    if (this.managerOptions.comments == "") {
      ans = false;
      messages.push("The Comments can't be empty. ");
    }
    if (this.companyName == "") {
      ans = false;
      messages.push("The Company Name can't be empty.");
    }
    if (!ans)
      this.errorMessages(messages);
    return ans;
  }

  public updateMessage(input: string) {
    this.messages[0] = "Manager " + input + " correctly";
    this.messageType = "success";
  }

  public errorMessages(input: string[]) {
    this.messages = input;
    this.messageType = "danger";
  }

  public errorMessage(error: string) {
    this.messages[0] = error;
    this.messageType = "danger";
  }

}
