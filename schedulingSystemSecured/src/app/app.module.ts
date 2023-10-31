import { NgModule } from '@angular/core';
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
    AppointmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SecurityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
