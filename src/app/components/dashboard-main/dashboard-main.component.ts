import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-main',
  standalone: false,

  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
  clinics: Clinic[] = [];
  filteredClinics: Clinic[] = [];
  selectedTab: string = 'access-filter';
  currentLanguage: string;
  isSidebarOpen: boolean = true;

  constructor(
    private clinicService: ClinicService,
    private languageService: LanguageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      
      if (params['selectedTab']) {
        this.selectedTab = params['selectedTab'];
      }
    });

    this.loadClinics();
  }

  onTabChange(tab: string) {
    console.log('in mainTab changed to:', tab);
    this.selectedTab = tab;
  }

  loadClinics(): void {
    this.clinicService.getTaxClinics().subscribe(
      (data: any[]) => {
        this.clinics = data.map((clinic) => ({
          id: clinic.id,
          organizationName: clinic.organization_name,
          organizationContact: clinic.organization_contact,
          contactPersonName: clinic.contact_person_name,
          contactPersonTitle: clinic.contact_person_title,
          contactEmail: clinic.contact_email,
          listedOnCra: clinic.listed_on_cra,
          visibleOnNceo: clinic.visible_on_nceo,
          alternateContactName: clinic.alternate_contact_name,
          alternateContactEmail: clinic.alternate_contact_email,
          alternateContactPhone: clinic.alternate_contact_phone,
          publicInfo: clinic.public_info,
          clinicTypes: clinic.clinic_types,
          wheelchairAccessible: clinic.wheelchair_accessible,
          servePeopleFrom: clinic.serve_people_from,
          catchmentArea: clinic.catchment_area,
          monthsOffered: clinic.months_offered,
          hoursOfOperation: clinic.hours_of_operation,
          yearRoundService: clinic.year_round_service,
          populationServed: clinic.population_served,
          serviceLanguages: clinic.service_languages,
          taxYearsPrepared: clinic.tax_years_prepared,
          residencyTaxYear: clinic.residency_tax_year,
          servePeople: clinic.serve_people,
          specialServices: clinic.special_services,
          bookingProcess: clinic.booking_process,
          bookingDaysHours: clinic.booking_days_hours,
          bookingContactPhone: clinic.booking_contact_phone,
          bookingContactEmail: clinic.booking_contact_email,
          onlineBookingLink: clinic.online_booking_link,
          usefulOnlineBooking: clinic.useful_online_booking,
          requiredDocuments: clinic.required_documents,
          helpWithMissingDocs: clinic.help_with_missing_docs,
          taxPreparers: clinic.tax_preparers,
          taxFilers: clinic.tax_filers,
          volunteerRoles: clinic.volunteer_roles,
          clinicCapacity: clinic.clinic_capacity,
          additionalSupport: clinic.additional_support,
          comments: clinic.comments,
          createdDate: clinic.created_at,
          updatedDate: clinic.updated_at,
          locations: Array.isArray(clinic.locations)
            ? clinic.locations.map((location: any) => ({
                id: location.id,
                taxClinicId: location.tax_clinic_id,
                street: location.street,
                city: location.city,
                state: location.state,
                postalCode: location.postal_code,
                createdDate: location.created_at,
                updatedDate: location.updated_at,
              }))
            : [],
        }));

        this.filteredClinics = [...this.clinics];
        console.log('the clinic details are....', this.filteredClinics);
      },
      (error) => {
        console.error('Failed to load tax clinics:', error);
      }
    );
  }

  applyFilters(filters: { [key: string]: any }): void {
    // this.filteredClinics = this.clinics.filter((clinic) => {
    //   const matchesName = filters['name']
    //     ? clinic.name.toLowerCase().includes(filters['name'].toLowerCase())
    //     : true;
    //   const matchesLanguage = filters['language']
    //     ? clinic.languageRequirements.includes(filters['language'])
    //     : true;
    //   const matchesType = filters['type']
    //     ? clinic.appointmentType.includes(filters['type'])
    //     : true;
    //   const matchesPopulation = filters['population']
    //     ? clinic.populationEligibility.includes(filters['population'])
    //     : true;
    //   const matchesDocuments = filters['documents']
    //     ? clinic.requiredDocuments.includes(filters['documents'])
    //     : true;
    //   return (
    //     matchesName &&
    //     matchesLanguage &&
    //     matchesType &&
    //     matchesPopulation &&
    //     matchesDocuments
    //   );
    // });
  }

  onLanguageChange(language: string): void {
    this.currentLanguage = language;
  }

  onFilterSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
