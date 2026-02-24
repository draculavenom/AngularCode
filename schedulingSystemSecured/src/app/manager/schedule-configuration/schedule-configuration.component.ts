import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-schedule-configuration',
  templateUrl: './schedule-configuration.component.html',
  styleUrls: ['./schedule-configuration.component.css']
})
export class ScheduleConfigurationComponent implements OnInit {
  isLoading = false;
  message: string | null = null;
  messageClass: string = '';
  managerId: number | null = null;

  config = {
    startTime: '09:00',
    endTime: '17:00',
    duration: 30
  };


  daysOfWeek = [
    { id: 'MONDAY', label: 'Monday', selected: false },
    { id: 'TUESDAY', label: 'Tuesday', selected: false },
    { id: 'WEDNESDAY', label: 'Wednesday', selected: false },
    { id: 'THURSDAY', label: 'Thursday', selected: false },
    { id: 'FRIDAY', label: 'Friday', selected: false },
    { id: 'SATURDAY', label: 'Saturday', selected: false },
    { id: 'SUNDAY', label: 'Sunday', selected: false }
  ];

  constructor(
    private managerService: ManagerService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUserDataAndSchedule();
  }

  loadUserDataAndSchedule() {
    this.isLoading = true;
    this.userService.getUser().subscribe({
      next: (user) => {
        this.managerId = user.id;
        this.loadCurrentConfiguration();
      },
      error: (err) => {
        this.showMessage("Error identifying user session.", "alert-danger");
        this.isLoading = false;
      }
    });
  }

  loadCurrentConfiguration() {
    if (!this.managerId) return;

    this.managerService.getWorkSchedule(this.managerId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.config.startTime = data[0].startingTime.substring(0, 5);
          this.config.endTime = data[0].endingTime.substring(0, 5);
          this.config.duration = data[0].appointmentDuration;

          const activeDays = data.map(d => d.day);
          this.daysOfWeek.forEach(d => d.selected = activeDays.includes(d.id));
        }
        this.isLoading = false;
      },
      error: () => {
        this.showMessage("Error loading schedule.", "alert-danger");
        this.isLoading = false;
      }
    });
  }

  toggleDay(day: any) {
    day.selected = !day.selected;
  }

  saveConfiguration() {
    if (!this.managerId) return;
    const selectedDays = this.daysOfWeek.filter(d => d.selected);
    if (selectedDays.length === 0) {
      this.showMessage('Select at least one working day.', 'alert-warning');
      return;
    }
    if (this.config.startTime >= this.config.endTime) {
      this.showMessage('Ending time must be after starting time.', 'alert-danger');
      return;
    }

    this.isLoading = true;
    const payload = {
      shifts: selectedDays.map(d => ({
        day: d.id,
        startingTime: this.config.startTime + ":00", 
        endingTime: this.config.endTime + ":00",
        appointmentDuration: this.config.duration
      }))
    };

    this.managerService.saveWorkSchedule(this.managerId, payload).subscribe({
      next: () => {
        this.showMessage('Schedule saved and slots updated!', 'alert-success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error saving configuration.', 'alert-danger');
        this.isLoading = false;
      }
    });
  }

  private showMessage(text: string, cssClass: string) {
    this.message = text;
    this.messageClass = cssClass;
    setTimeout(() => this.message = null, 5000);
  }
}