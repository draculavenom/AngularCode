import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonComponent } from './person/person.component';
import { PersonFormComponent } from './person/person-form/person-form.component';

const routes: Routes = [
  { path: '', component: PersonComponent },
  { path: 'person', component: PersonComponent },
  { path: 'person/create', component: PersonFormComponent },
  { path: 'person/:id', component: PersonFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
