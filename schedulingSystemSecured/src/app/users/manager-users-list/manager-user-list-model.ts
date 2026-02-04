export interface UserDTO {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    managedBy: number;
    role: string;
    passwordChange: boolean;
}