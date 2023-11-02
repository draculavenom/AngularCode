import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { UsersModel } from '../users.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UsersModel = new UsersModel(0, "", false);
  message: string = "";
  messageType: string = "";

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUser();
  }

  public getUser(){
    this.route.params.subscribe(params => {
      if(params['id'] !== null && params['id'] !== undefined)
        this.userService.getUserById(parseInt(params['id']!)).subscribe(u => this.user = u);
    });
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

}
