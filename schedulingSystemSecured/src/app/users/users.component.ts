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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadInfo();
  }

  public loadInfo(){
    this.userService.getUser().subscribe(data => {
      console.log(data);
      this.user = new UsersModel(1,"",true);
    },
    error => console.log(error.erorr));
  }

}
