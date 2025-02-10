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
          organisationWebsite: clinic.organisation_website,
          organisationalEmail: clinic.organisation_email,
          contactPersonName: clinic.contact_person_name,
          contactPersonTitle: clinic.contact_person_title,
          contactEmail: clinic.contact_email,
          appointmentAvailability: clinic.appointment_available,
          listedOnCra: clinic.listed_on_cra,
          visibleOnNceo: clinic.visible_on_nceo,
          alternateContactName: clinic.alternate_contact_name,
          alternateContactEmail: clinic.alternate_contact_email,
          alternateContactPhone: clinic.alternate_contact_phone,
          alternateContactTitle: clinic.alternate_contact_title,
          publicInfo: clinic.public_info,
          clinicTypes: clinic.clinic_types,
          wheelchairAccessible: clinic.wheelchair_accessible,
          servePeopleFrom: clinic.serve_people_from,
          catchmentArea: clinic.catchment_area,
          monthsOffered: clinic.months_offered,
          hoursAndDate: clinic.date_and_time_of_operation,
          hoursOfOperation: clinic.hours_of_operation,
          daysOfOperation: clinic.days_of_operation,
          yearRoundService: clinic.year_round_service,
          populationServed: clinic.population_served,
          serviceLanguages: clinic.service_languages,
          taxYearsPrepared: clinic.tax_years_prepared,
          residencyTaxYear: clinic.residency_tax_year,
          servePeople: clinic.serve_people,
          eligibilityCriteriaWebpage: clinic.eligibility_criteria_webpage,
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

        this.sortClinics();
        console.log('the clinic details are....', this.filteredClinics);
      },
      (error) => {
        console.error('Failed to load tax clinics:', error);
      }
    );
  }

  sortClinics() {
    const priority: Record<string, number> = { 'Yes': 1, 'No': 2, 'Not Sure': 3 };
  
    this.filteredClinics.sort((a, b) => {
      const priorityA = priority[a.appointmentAvailability] ?? 4;
      const priorityB = priority[b.appointmentAvailability] ?? 4;
  
      return priorityA - priorityB;
    });
  }

  applyFilters(filters: { [key: string]: any } | null): void {
    if (!filters) {
      console.log('Resetting filters. Showing all clinics.');
      this.filteredClinics = [...this.clinics];
    } else {
      this.filteredClinics = this.clinics.filter((clinic) => {
        const matchesServiceDelivery =
          (filters['serviceDeliveryModes']?.inPerson &&
            clinic.clinicTypes?.includes('In Person')) ||
          (filters['serviceDeliveryModes']?.virtual &&
            clinic.clinicTypes?.includes('Virtual')) ||
          (filters['serviceDeliveryModes']?.byAppointment &&
            clinic.clinicTypes?.includes('By appointment')) ||
          (filters['serviceDeliveryModes']?.walkIn &&
            clinic.clinicTypes?.includes('Walk in')) ||
          (!filters['serviceDeliveryModes']?.inPerson &&
            !filters['serviceDeliveryModes']?.virtual &&
            !filters['serviceDeliveryModes']?.byAppointment &&
            !filters['serviceDeliveryModes']?.walkIn);

        const matchesSupportedTaxYears =
          (filters['supportedTaxYears']?.currentYear &&
            clinic.taxYearsPrepared?.includes('Current Year')) ||
          (filters['supportedTaxYears']?.currentLastYears &&
            clinic.taxYearsPrepared?.includes('Current and last year')) ||
          (filters['supportedTaxYears']?.multipleYears &&
            clinic.taxYearsPrepared?.includes('Multiple years')) ||
          (!filters['supportedTaxYears']?.currentYear &&
            !filters['supportedTaxYears']?.currentLastYears &&
            !filters['supportedTaxYears']?.multipleYears);

        const matchesProvinces =
          (filters['provinces']?.Ontario &&
            clinic.residencyTaxYear.includes('Ontario')) ||
          (filters['provinces']?.Quebec &&
            clinic.residencyTaxYear.includes('Québec')) ||
          (filters['provinces']?.Other &&
            clinic.residencyTaxYear.includes(
              'Other than Ontario and Quebec'
            )) ||
          (!filters['provinces']?.Ontario &&
            !filters['provinces']?.Quebec &&
            !filters['provinces']?.Other);

        const matchesLanguage =
          (filters['languageOptions']?.french &&
            clinic.serviceLanguages?.includes('French')) ||
          (filters['languageOptions']?.english &&
            clinic.serviceLanguages?.includes('English')) ||
          (filters['languageOptions']?.arabic &&
            clinic.serviceLanguages?.includes('Arabic')) ||
          (filters['languageOptions']?.other &&
            clinic.serviceLanguages?.includes(
              filters['languageOptions'].otherLanguage
            )) ||
          (!filters['languageOptions']?.french &&
            !filters['languageOptions']?.english &&
            !filters['languageOptions']?.arabic &&
            !filters['languageOptions']?.other);

        const matchesClient =
          (filters['clientCategories']?.newcomers &&
            clinic.populationServed?.includes('Newcomers')) ||
          (filters['clientCategories']?.students &&
            clinic.populationServed?.includes('Students')) ||
          (filters['clientCategories']?.indigenousClients &&
            clinic.populationServed?.includes('Indigenous')) ||
          (filters['clientCategories']?.seniors &&
            clinic.populationServed?.includes('Seniors')) ||
          (filters['clientCategories']?.disabilities &&
            clinic.populationServed?.includes('Persons with disabilities')) ||
          (!filters['clientCategories']?.newcomers &&
            !filters['clientCategories']?.students &&
            !filters['clientCategories']?.indigenousClients &&
            !filters['clientCategories']?.seniors &&
            !filters['clientCategories']?.disabilities);

        const matchesAccessDocuments =
          (filters['accessDocuments']?.allDocuments &&
            clinic.helpWithMissingDocs?.includes(
              'Yes for CRA documents with Autofill/repid'
            )) ||
          (filters['accessDocuments']?.someDocuments &&
            clinic.helpWithMissingDocs?.includes(
              'Yes with help from staff or volunteer for some documentation'
            )) ||
          (filters['accessDocuments']?.noDocuments &&
            clinic.helpWithMissingDocs?.includes(
              'No, client must have all their documents ready'
            )) ||
          (!filters['accessDocuments']?.allDocuments &&
            !filters['accessDocuments']?.someDocuments &&
            !filters['accessDocuments']?.noDocuments);

        const matchesAppointmentBooking =
          (filters['appointmentBooking']?.onlineAppointment &&
            clinic.bookingProcess.includes('Online')) ||
          (filters['appointmentBooking']?.phone &&
            clinic.bookingProcess.includes('By Phone')) ||
          (filters['appointmentBooking']?.inPerson &&
            clinic.bookingProcess.includes('In Person')) ||
          (!filters['appointmentBooking']?.onlineAppointment &&
            !filters['appointmentBooking']?.phone &&
            !filters['appointmentBooking']?.inPerson);

        const matchesAppointmentAvailability =
          (filters['appointmentType'] === 'yes' &&
            clinic.appointmentAvailability === 'Yes') ||
          (filters['appointmentType'] === 'no' &&
            clinic.appointmentAvailability === 'No') ||
          (filters['appointmentType'] === 'any' &&
            clinic.appointmentAvailability === 'Not Sure') ||
          filters['appointmentType'] === '';

        return (
          matchesSupportedTaxYears &&
          matchesProvinces &&
          matchesLanguage &&
          matchesClient &&
          matchesAccessDocuments &&
          matchesServiceDelivery &&
          matchesAppointmentBooking &&
          matchesAppointmentAvailability
        );
      });
    }
    this.sortClinics();
  }

  onLanguageChange(language: string): void {
    this.currentLanguage = language;
  }

  onFilterSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
