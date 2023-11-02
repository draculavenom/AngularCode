import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from './users/users.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { PersonComponent } from './person/person.component';
import { PersonFormComponent } from './person/person-form/person-form.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AppointmentComponent } from './schedule/appointment/appointment.component';
import { AuthGuard } from './security/auth.guard';
import { UserComponent } from './users/user/user.component';
import { ManagerUserComponent } from './users/manager-user/manager-user.component';

const routes: Routes = [
  { path: '', component: ScheduleComponent, canActivate: [AuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/createManager', component: ManagerUserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] },
  { path: 'schedule/appointment', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'schedule/appointment/:id', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'person', component: PersonComponent },
  { path: 'person/create', component: PersonFormComponent },
  { path: 'person/:id', component: PersonFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
