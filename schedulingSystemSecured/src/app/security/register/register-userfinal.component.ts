import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { UsersModel } from 'src/app/users/users.model';
import { UserService } from 'src/app/users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { ConfigService } from 'src/app/services/config.service';
import { ManagerProfile } from 'src/app/manager/manager-personalization/manager-profile.model';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-userfinal.component.html',
  styleUrls: ['./register-userfinal.component.css'],
  providers: [NgbDatepickerConfig]
})
export class RegisterUserFinalComponent implements OnInit {
  messages: string[] = [];
  messageType = "";
  user: UsersModel = new UsersModel(0, "", true);
  managerSelect: any[] = [];
  profilesMap: { [key: number]: ManagerProfile } = {};
  showCompanySelection: boolean = true;
  selectedProfile: ManagerProfile | null = null;
  modelDate!: NgbDateStruct;
  searchTerm: string = '';

  constructor(
    private securityService: SecurityService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private configService: ConfigService,
    private config: NgbDatepickerConfig,
  ) {
    const current = new Date();
    this.config.minDate = { year: 1920, month: 1, day: 1 };
    this.config.maxDate = { year: current.getFullYear(), month: 12, day: 31 };
    this.config.navigation = 'select';
    this.config.outsideDays = 'hidden';
  }


  onDateChange(date: NgbDateStruct) {
    if (date) {
      const month = date.month;
      const day = date.day;
      this.user.dateOfBirth = new Date(date.year, month - 1, day);
    }
  }
  ngOnInit(): void {
    this.user.role = "USER";
    this.user.managedBy = 0;

    this.userService.getManagerSelect().subscribe((l: any) => {
      this.managerSelect = l;
      this.managerSelect.forEach(m => {
        this.managerService.getPublicManagerProfile(m.managerId).subscribe({
          next: (profile) => {
            if (!profile.logo || profile.logo === 'SYSTEM_DEFAULT_CREAR_LOGO') {
              profile.logo = 'assets/img/logos/default-avatar.png';
            }
            else if (!profile.logo.startsWith('http') && !profile.logo.startsWith('assets')) {
              const baseUrl = this.configService.apiUrl.replace(/\/$/, '');
              profile.logo = `${baseUrl}${profile.logo}`;
            }
            this.profilesMap[m.managerId] = profile;
          },
          error: () => {

            this.profilesMap[m.managerId] = {
              id: m.managerId,
              logo: 'assets/img/logos/default-avatar.png',
              introduction: 'Professional service provider.',
              managerFullName: m.name
            };
          }
        });
      });

      this.route.queryParams.subscribe(params => {
        const id = +params['managerId'] || +params['managerid'];
        if (id) {
          setTimeout(() => this.selectCompany(id), 500);
        }
      });
    });
  }
  public selectCompany(id: number) {
    this.user.managedBy = id;
    this.showCompanySelection = false;
    this.selectedProfile = this.profilesMap[id] || null;
  }
  public toggleCompanySelection() {
    this.showCompanySelection = !this.showCompanySelection;

  }
  public getManagerData(id: number): ManagerProfile | undefined {
    return this.profilesMap[id];
  }

  public onSubmit() {
    this.securityService.registerUser(this.user).subscribe({
      next: (data: any) => {
        sessionStorage.setItem('bearerToken', data);
        this.securityService.updateAuthStatus(true);
        this.messageType = "success";
        this.messages = ["Please, now select the date and time for your first appointment."];
        setTimeout(() => {
          this.router.navigate(['/schedule/appointment']);
        }, 1500);
      },
      error: (err: any) => {
        this.messageType = "danger";
        this.messages = Array.isArray(err.error) ? err.error : [err.error || "Error"];
      }
    });
  }
  public getCompanyName(id: number | undefined): string {
    if (!id) return 'Company';
    const match = this.managerSelect.find(m => m.managerId === id);
    if (match) {
      return match.name || match.companyName || 'Professional Studio';
    }
    return 'Company';
  }
  get filteredManagers() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.managerSelect;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.managerSelect.filter(opt => {
      const companyName = (opt.nameCompany || '').toLowerCase();
      const optName = (opt.name || '').toLowerCase();
      const profile = this.profilesMap[opt.managerId];
      const managerFullName = (profile?.managerFullName || '').toLowerCase();

      return companyName.includes(term) ||
        optName.includes(term) ||
        managerFullName.includes(term);
    });
  }

}