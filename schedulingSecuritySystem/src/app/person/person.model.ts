export class PersonModel{
    id: number;
    typeOfUser: string;
    name: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;

    constructor (id: number, typeOfUser: string, name: string, lastName: string, username: string, phoneNumber: string, email: string, dateOfBirth: string){
        this.id = id;
        this.typeOfUser = typeOfUser;
        this.name = name;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
    }
}