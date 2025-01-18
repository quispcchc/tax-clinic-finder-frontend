import { Component, OnInit } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  clinics: Clinic[] = [];
  filteredClinics: Clinic[] = [];
  selectedTab: string = 'Access Filter';
  currentLanguage: string;

  constructor(
    private clinicService: ClinicService,
    private authService: AuthService,
    private languageService: LanguageService
  ) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  ngOnInit(): void {
    this.loadClinics();
  }

  changeTab(tab: string): void {
    this.selectedTab = tab;
  }

  loadClinics(): void {
    this.clinicService.getTaxClinics().subscribe(
      (data: any[]) => {
        this.clinics = data.map((clinic) => ({
          id: clinic.id,
          name: clinic.clinic_name,
          street: clinic.street,
          city: clinic.city,
          state: clinic.state,
          postalcode: clinic.postalcode,
          appointmentsAvailable: clinic.appointments_available,
          languageRequirements: clinic.language_requirements,
          appointmentType: clinic.appointment_type,
          populationEligibility: clinic.population_eligibility,
          requiredDocuments: clinic.required_documents,
          website: clinic.website,
          createdAt: clinic.created_at,
          updatedAt: clinic.updated_at,
        }));
        this.filteredClinics = [...this.clinics];
      },
      (error) => {
        console.error('Failed to load tax clinics:', error);
      }
    );
  }

  applyFilters(filters: { [key: string]: any }): void {
    this.filteredClinics = this.clinics.filter((clinic) => {
      const matchesName = filters['name']
        ? clinic.name.toLowerCase().includes(filters['name'].toLowerCase())
        : true;
      const matchesLanguage = filters['language']
        ? clinic.languageRequirements.includes(filters['language'])
        : true;
      const matchesType = filters['type']
        ? clinic.appointmentType.includes(filters['type'])
        : true;
      const matchesPopulation = filters['population']
        ? clinic.populationEligibility.includes(filters['population'])
        : true;
      const matchesDocuments = filters['documents']
        ? clinic.requiredDocuments.includes(filters['documents'])
        : true;

      return (
        matchesName &&
        matchesLanguage &&
        matchesType &&
        matchesPopulation &&
        matchesDocuments
      );
    });
  }

  onLanguageChange(language: string): void {
    this.currentLanguage = language;
  }

  logout(): void {
    this.authService.logout();
  }
}
