import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserDTO } from './manager-user-list-model';
import { UsersModel } from '../users.model';

@Component({
  selector: 'app-manager-users-list',
  templateUrl: './manager-users-list.component.html',
  styleUrls: ['./manager-users-list.component.css']
})
export class ManagerUsersListComponent implements OnInit {
  users: UserDTO[] = [];
  currentUser?: UsersModel;

  constructor(private userService: UserService) { }

ngOnInit(): void {
  this.userService.getUser().subscribe({
    next: (userData) => {
      this.currentUser = userData; 
      
      if (this.currentUser?.id) {
        this.loadSubordinates(this.currentUser.id);
      }
    },
  });
}

loadSubordinates(id: number) {
  this.userService.getPersonsByManager(id).subscribe({
    next: (data) => {
      this.users = data; 
    },
  });
}
}

