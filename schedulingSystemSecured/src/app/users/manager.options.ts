export class ManagerOptionsModel{
    id: number;
    name: string;
    managerId: number;
    adminId: number;
    ammountPaid: number;
    activeDate: Date;
    comments: string;

    constructor(id: number, name?: string, managerId?: number, adminId?: number, ammountPaid?: number, activeDate?: Date, comments?: string){
        this.id = id;
        if (name)
            this.name = name;
        else
            this.name = "";
        if (managerId)
            this.managerId = managerId;
        else
            this.managerId = 0;
        if (adminId)
            this.adminId = adminId;
        else
            this.adminId = 0;
        if (ammountPaid)
            this.ammountPaid = ammountPaid;
        else
            this.ammountPaid = 0;
        if (activeDate)
            this.activeDate = activeDate;
        else
            this.activeDate = new Date();
        if (comments)
            this.comments = comments;
        else
            this.comments = "";
    }
}