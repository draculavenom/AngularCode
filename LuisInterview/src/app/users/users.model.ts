export class UsersModel{
    id: number;
    name: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    enabled: boolean;

    constructor (id: number, name: string, lastName: string, username: string, password: string, email: string, enabled: boolean){
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.enabled = enabled;
    }
}