import { Component } from '@angular/core';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';

@Component({
  selector: 'app-manager-options',
  templateUrl: './manager-options.component.html',
  styleUrls: ['./manager-options.component.css']
})
export class ManagerOptionsComponent {
  searchId: number | null = null;
  errorMessage: string = '';
  
  public managerOptionsList: ManagerOptionsModel[] = [];

  constructor(private managerService: ManagerService) {}

  loadData(): void {
    if (!this.searchId) return;

    this.managerService.getManagerOptions(this.searchId).subscribe({
      next: (data: ManagerOptionsModel[]) => {
        if (data && data.length > 0) {
          this.managerOptionsList = data;
          this.errorMessage = '';
        } else {
          this.managerOptionsList = [];
          this.errorMessage = 'No records found for the given Manager ID.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error fetching data from the server.';
        this.managerOptionsList = [];
      }
    });
  }
}