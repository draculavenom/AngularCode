export class UsersModel{
    id: number;
    email: string;
    enabled: boolean;
    name: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: Date;
    managedBy: number;
    role: string;
    passwordChange: boolean;

    constructor (id: number, email: string, enabled: boolean, name?: string, firstName?: string, lastName?: string, password?: string, phoneNumber?: string, dateOfBirth?: Date, managedBy?: number, role?: string, passwordChange?: boolean){
        this.id = id;
        this.email = email;
        this.enabled = enabled;
        if(name)
            this.name = name;
        else
            this.name = "";
        if(firstName)
            this.firstName = firstName;
        else
            this.firstName = "";
        if(lastName)
            this.lastName = lastName;
        else
            this.lastName = "";
        if(password)
            this.password = password;
        else
            this.password = "";
        if(phoneNumber)
            this.phoneNumber = phoneNumber;
        else
            this.phoneNumber = "";
        if(dateOfBirth)
            this.dateOfBirth = dateOfBirth;
        else
            this.dateOfBirth = new Date();
        if(managedBy)
            this.managedBy = managedBy;
        else
            this.managedBy = 0;
        if(role)
            this.role = role;
        else
            this.role = "USER";
        if(passwordChange)
            this.passwordChange = passwordChange;
        else
            this.passwordChange = false;
    }
}