import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PersonService } from '../person.service';
import { PersonModel } from '../person.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  @Input() public person: PersonModel = new PersonModel(0, "", "", "", "", "", "", "");
  messages: string = "";
  routeSub: any;
  updateFlag: boolean = false;

  constructor(private personService: PersonService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    console.log(this.person);
    this.routeSub = this.route.params.subscribe(params => {
      if(params['id']){
        this.personService.getPerson(params['id'])
        .subscribe(p => this.person = p);
        this.updateFlag = true;
      }
      else{this.person = new PersonModel(0, "test", "test", "test", "test", "test@test.com", "1234567890", "1991-05-12")}//456123 Only for testing purposes, erase one completed the functionality of the creation of the person
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onSave(): void{
    console.log(this.person);
    console.log(this.person.name);
    if(this.validateForm()){
      if(this.updateFlag){
        this.personService.updatePerson(this.person).subscribe(
          data => {console.log('data', data);
          this.sendToPersonList()}
        );
      }
      this.personService.createPerson(this.person).subscribe(
        data => {console.log('data', data);
          this.sendToPersonList()}
      );
    }
  }

  sendToPersonList(){
    this.router.navigate(["/", "person"]);
  }

  validateForm(): boolean{
    let ans: boolean = true;
    this.messages = "";
    if(!this.person.name.trim()){
      this.messages += "Name can't be empty. ";
      ans = false;
    }
    if(!this.person.lastName.trim()){
      this.messages += "Last Name can't be empty. ";
      ans = false;
    }
    if(!this.person.typeOfUser.trim()){
      this.messages += "Type Of User can't be empty. ";
      ans = false;
    }
    if(!this.person.username.trim()){
      this.messages += "Username can't be empty. ";
      ans = false;
    }
    if(!this.person.email.trim()){
      this.messages += "Email can't be empty. ";
      ans = false;
    }
    if(!this.person.phoneNumber.trim()){
      this.messages += "Phone Number can't be empty. ";
      ans = false;
    }
    if(!this.person.dateOfBirth.trim()){
      this.messages += "Date Of Birth can't be empty. ";
      ans = false;
    }
    return ans;
  }

}
