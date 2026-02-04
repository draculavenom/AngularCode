import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NotificationService, NotificationSettings } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  wantsNotifications = new FormControl(false);
  isLoading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
  this.notificationService.getSelfSettings().subscribe({
    next: (settings) => {
      this.wantsNotifications.setValue(settings.emailEnabled && settings.appointmentCreated);
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading settings', err);
      this.isLoading = false;
    }
  });
}

savePreference() {
  const isChecked = this.wantsNotifications.value;
  
  const request: NotificationSettings = {
    emailEnabled: isChecked,
    appointmentCreated: isChecked
  };

  this.notificationService.updateSelfSettings(request).subscribe({
    next: () => {
      alert('Preferences updated successfully');
      this.wantsNotifications.markAsPristine();
    },
    error: (err) => {
      console.error('Error saving', err);
      alert('The settings could not be saved. Please try again later.');
    }
  });
}
}