import { Component, OnInit } from '@angular/core';
import { PersonService } from './person.service';
import { PersonModel } from './person.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  persons: PersonModel[] = [];

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.personService.getPersons()
      .subscribe(allPersons => {
        this.persons = allPersons;
      })
  }

}
