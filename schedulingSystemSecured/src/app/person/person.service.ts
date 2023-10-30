import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonModel } from './person.model';
import { SecurityService } from '../security/security.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  headers = {
    "content-type": "application/json",
    "Accept": "*/*",
    "token": ""
  };

  constructor(private http: HttpClient, private securityService: SecurityService) {
    this.headers.token = this.securityService.getToken();
  }

  public createPerson(personData: PersonModel){
    return this.http.post<PersonModel>('http://localhost:8080/person', personData, {headers: this.headers, responseType: 'json'});
  }

  public updatePerson(personData: PersonModel){
    return this.http.put<PersonModel>('http://localhost:8080/person/' + personData.id, personData, {headers: this.headers, responseType: 'json'});
  }

  public getPersons(){
    return this.http.get<PersonModel[]>('http://localhost:8080/person', {headers: this.headers, responseType: 'json'});
  }

  public getPerson(id: string){
    return this.http.get<PersonModel>('http://localhost:8080/person/' + id, {headers: this.headers, responseType: 'json'});
  }

  public testBackend(){
    
    const body = {
      "username": "user",
      "password": "password"
    };
    //const req = this.http.post('http://localhost:8080/person', body, {headers: this.headers, responseType: 'text'});
    const req = this.http.get('http://localhost:8080/person', {headers: this.headers, responseType: 'text'});
    req.subscribe(
      data => console.log('data', data),
      error => console.log('error', error)
    );
  }
}
