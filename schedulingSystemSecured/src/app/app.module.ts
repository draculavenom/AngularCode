import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LeftBarComponent } from './layout/left-bar/left-bar.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { SecurityService } from './security/security.service';
import { PersonComponent } from './person/person.component';
import { PersonFormComponent } from './person/person-form/person-form.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AppointmentComponent } from './schedule/appointment/appointment.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CancelDialogComponent } from './layout/cancel-dialog/cancel-dialog.component';
import { AuthGuard } from './security/auth.guard';
import { UserComponent } from './users/user/user.component';
import { ManagerUserComponent } from './users/manager-user/manager-user.component';
import { PasswordDialogComponent } from './layout/password-dialog/password-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { OnboardingComponent } from './schedule/appointment/onboarding/onboarding.component';
import { ManagerUsersListComponent } from './users/manager-users-list/manager-users-list.component';  
import { OnboardingFinalComponent } from './schedule/appointment/onboarding-final/onboarding-final.component';    
import { RegisterUserFinalComponent } from './security/register/register-userfinal.component';
import { ConfigService } from './services/config.service';
import { NotificationComponent } from './manager/notification/notification.component';

export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    HeaderComponent,
    FooterComponent,
    LeftBarComponent,
    LoginComponent,
    RegisterComponent,
    PersonComponent,
    PersonFormComponent,
    ScheduleComponent,
    AppointmentComponent,
    CancelDialogComponent,
    UserComponent,
    ManagerUserComponent,
    PasswordDialogComponent,
    ResetPasswordComponent,
    ManagerUsersListComponent,
    OnboardingComponent,
    OnboardingFinalComponent,
    RegisterUserFinalComponent,
    NotificationComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    MatGridListModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule
  ],
  providers: [SecurityService, AuthGuard, 
    ConfigService,
     {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [ConfigService],
    multi: true
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
