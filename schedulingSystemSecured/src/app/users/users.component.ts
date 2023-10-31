import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { UsersModel } from './users.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user: UsersModel = new UsersModel(0,"",true,"something");

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadInfo();
  }

  public loadInfo(){
    this.userService.getUser().subscribe(data => {
      console.log(data);
      //console.log(data.id);
      this.user = new UsersModel(data.id,data.email,true,data.name,"", "", "", data.phoneNumber, data.dateOfBirth, data.managedBy);
    },
    error => console.log(error.erorr));
    console.log(this.user);
  }

}
