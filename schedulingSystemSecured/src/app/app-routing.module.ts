import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { PersonComponent } from './person/person.component';
import { PersonFormComponent } from './person/person-form/person-form.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AppointmentComponent } from './schedule/appointment/appointment.component';
import { AuthGuard } from './security/auth.guard';
import { UserComponent } from './users/user/user.component';
import { ManagerUserComponent } from './users/manager-user/manager-user.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { OnboardingComponent } from './schedule/appointment/onboarding/onboarding.component';
import { ManagerUsersListComponent } from './users/manager-users-list/manager-users-list.component';
import { OnboardingFinalComponent } from './schedule/appointment/onboarding-final/onboarding-final.component';
import { RegisterUserFinalComponent } from './security/register/register-userfinal.component';
import { NotificationComponent } from './manager/notification/notification.component';
import { ManagerOptionsComponent } from './manager/manager-options/manager-options.component';
import { CalendarComponent } from './schedule/calendar/calendar.component';

const routes: Routes = [
  { path: '', component: OnboardingFinalComponent},
  { path: 'dashboard', component: ScheduleComponent, canActivate: [AuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/createManager', component: ManagerUserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] },
  { path: 'schedule/appointment', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'schedule/appointment/:id', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'person', component: PersonComponent },
  { path: 'person/create', component: PersonFormComponent },
  { path: 'person/:id', component: PersonFormComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'manager-users-list', component: ManagerUsersListComponent, canActivate: [AuthGuard] },
  { path: 'onboarding-final', component: OnboardingFinalComponent },
  { path: 'register-final', component: RegisterUserFinalComponent },
  { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'manager-options', component: ManagerOptionsComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
