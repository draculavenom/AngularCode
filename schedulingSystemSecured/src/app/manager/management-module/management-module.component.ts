import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ManagerService } from 'src/app/schedule/manager/manager.service';

@Component({
  selector: 'app-management-module',
  templateUrl: './management-module.component.html',
  styleUrls: ['./management-module.component.css']
})
export class ManagementModuleComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;
  managerId: number = 0;
  managersList: any[] = [];
  message: string = '';
  messageClass: string = '';

  whatsappNotification = new FormControl(true);

  constructor(private managerService: ManagerService) {}

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers() {
    this.managerService.getManagerNameSelect().subscribe({
      next: (data) => this.managersList = data,
      error: () => this.showError('Error al cargar la lista de managers')
    });
  }

  onManagerChange() {
    if (this.managerId > 0) {
      this.isLoading = true;
      this.message = '';
      this.managerService.getManagementModules(this.managerId).subscribe({
        next: (res) => {
          this.whatsappNotification.setValue(res.whatsappNotification);
          this.whatsappNotification.markAsPristine(); 
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.showError("Preferences couldn't be obtained.");
        }
      });
    }
  }

  savePreference() {
    if (this.managerId === 0) return;

    this.isSaving = true;
    this.message = '';
    
    this.managerService.updateManagementModules(this.managerId, this.whatsappNotification.value!).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.message = 'Module configuration successfully updated';
        this.messageClass = 'alert-success';
        this.whatsappNotification.markAsPristine();
      },
      error: () => {
        this.isSaving = false;
        this.showError('Error saving. Please try again later.');
      }
    });
  }

  private showError(msg: string) {
    this.message = msg;
    this.messageClass = 'alert-danger';
  }
}