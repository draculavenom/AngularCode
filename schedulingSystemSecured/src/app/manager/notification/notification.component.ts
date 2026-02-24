import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationService, NotificationSettings } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  isLoading = true;
  emailEnabled = new FormControl(true);
  appointmentCreated = new FormControl(true);
  paymentRunsOut = new FormControl(true);
  appointmentStatusChanges = new FormControl(true);
  appointmentTimeManager = new FormControl(true);
  appointmentTimeUser = new FormControl(true);

  message: string | null = null;
  messageClass: string = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getSelfSettings().subscribe({
      next: (settings) => {
        console.log('Datos recibidos:', settings);
        this.emailEnabled.setValue(!!settings.emailEnabled);
        this.appointmentCreated.setValue(!!settings.appointmentCreated);
        this.paymentRunsOut.setValue(!!settings.paymentRunsOut);
        this.appointmentStatusChanges.setValue(!!settings.appointmentStatusChanges);
        this.appointmentTimeManager.setValue(settings.appointmentTimeManager || true);
        this.appointmentTimeUser.setValue(settings.appointmentTimeUser || true);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading settings', err);
        this.isLoading = false;
      }
    });
  }

  savePreference() {
    const request: NotificationSettings = {
      emailEnabled: this.emailEnabled.value,
      appointmentCreated: this.appointmentCreated.value,
      paymentRunsOut: this.paymentRunsOut.value,
      appointmentStatusChanges: this.appointmentStatusChanges.value,
      appointmentTimeManager: this.appointmentTimeManager.value,
      appointmentTimeUser: this.appointmentTimeUser.value
    };

    this.notificationService.updateSelfSettings(request).subscribe({
      next: () => {
        this.showMessage('Preferences updated successfully', 'alert-success');
        this.markAsPristine();
      },
      error: () => this.showMessage('The settings could not be saved. Please try again.', 'alert-danger')
    });
  }
  private showMessage(text: string, cssClass: string) {
    this.message = text;
    this.messageClass = cssClass;
    setTimeout(() => this.message = null, 5000);
  }

  private markAsPristine() {
    this.emailEnabled.markAsPristine();
    this.appointmentCreated.markAsPristine();
    this.paymentRunsOut.markAsPristine();
    this.appointmentStatusChanges.markAsPristine();
    this.appointmentTimeManager.markAsPristine();
    this.appointmentTimeUser.markAsPristine();
  }
}