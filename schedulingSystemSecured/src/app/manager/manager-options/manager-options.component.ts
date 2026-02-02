import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { ManagerOptionsModel } from 'src/app/users/manager.options';

@Component({
  selector: 'app-manager-options',
  templateUrl: './manager-options.component.html',
  styleUrls: ['./manager-options.component.css']
})
export class ManagerOptionsComponent implements OnInit {
  selectedManager: number | null = null;
  errorMessage: string = '';
  
  public managerOptionsList: ManagerOptionsModel[] = [];
  public managerList: any[] = [];

  constructor(private managerService: ManagerService) {}

  ngOnInit(): void {
    this.loadManagerForSelect();
  }
  loadManagerForSelect(): void {
    // Usamos el método que creamos anteriormente
    this.managerService.getManagerNameSelect().subscribe({
      next: (data) => {
        console.log('DATOS RECIBIDOS DE JAVA:', data);
        this.managerList = data;
      },
      error: (err) => {
        console.error('ERROR AL CARGAR:', err);
        this.errorMessage = 'Error fetching manager list from the server.';
      }
    });
  }

  loadData(): void {
    if (!this.selectedManager) {
      this.errorMessage = 'Please select a manager first.';
      return;
    }

    this.managerService.getManagerOptions(this.selectedManager).subscribe({
      next: (data: ManagerOptionsModel[]) => {
        if (data && data.length > 0) {
          this.managerOptionsList = data;
          this.errorMessage = '';
        } else {
          this.managerOptionsList = [];
          this.errorMessage = 'No records found for this manager.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error fetching data from the server.';
        this.managerOptionsList = [];
      }
    });
  }
}