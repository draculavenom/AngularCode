import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { UsersModel } from './users.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user: UsersModel = new UsersModel(0,"",true);
  users: UsersModel[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadUsersInfo();
  }

  public loadUserInfo(){
    this.userService.getUser().subscribe(data => {
      this.user = new UsersModel(data.id,data.email,true,data.name,"", "", "", data.phoneNumber, data.dateOfBirth, data.managedBy);
    },
    error => console.log(error.erorr));
  }

  public loadUsersInfo(){
    this.userService.getUsers().subscribe(usersList => this.users = usersList, error => console.log(error.erorr));
  }

}
