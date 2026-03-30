import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/schedule/manager/manager.service';
import { ManagerProfile } from './manager-profile.model';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-manager-personalization',
  templateUrl: './manager-personalization.component.html',
  styleUrls: ['./manager-personalization.component.css']
})
export class ManagerPersonalizationComponent implements OnInit {

  profile!: ManagerProfile;

  selectedFile: File | null = null;
  imagePreview: any = null;

  loading: boolean = true;
  isSaving: boolean = false;
  message: { text: string; type: 'success' | 'danger' } | null = null;

  constructor(
    private managerService: ManagerService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.getProfileData();
  }
  showMessage(text: string, type: 'success' | 'danger') {
    this.message = { text, type };
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  getProfileData() {
    this.loading = true;
    this.managerService.getMyPersonalizationProfile().subscribe({
      next: (data) => {
        this.profile = data;

        if (data.logo && data.logo !== 'SYSTEM_DEFAULT_CREAR_LOGO') {

          const baseUrl = this.configService.apiUrl.replace(/\/$/, '');

          const path = data.logo.startsWith('/') ? data.logo : '/' + data.logo;

          this.imagePreview = `${baseUrl}${path}`;

          console.log("🚀 URL FINAL:", this.imagePreview);
        } else {
          this.imagePreview = null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Error al obtener perfil", err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.isSaving = true;

    this.managerService.updatePersonalizationProfile(this.profile.introduction, this.selectedFile)
      .subscribe({
        next: () => {
          this.showMessage("Profile successfully updated!", "success");
          this.isSaving = false;
          this.selectedFile = null;
        },
        error: (err) => {
          console.error("Error al guardar", err);
          this.showMessage("There was an error saving the changes. Please try again.", "danger");
          this.isSaving = false;
        }
      });
  }
}