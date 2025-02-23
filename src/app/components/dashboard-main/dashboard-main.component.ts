import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

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
  userEmail = localStorage.getItem('userEmail');
  filteredData: any = {};
  isNewClient: boolean = false;
  newClientId: string = '';

  constructor(
    private http: HttpClient,
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
          catchmentBoundaries: clinic.catchment_boundaries,
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

  async applyFilters(event: {
    filters: { [key: string]: any } | null;
    isNewClient: boolean;
  }) {
    if (!event) {
      console.log('Resetting filters. Showing all clinics.');
      this.filteredClinics = [...this.clinics];
      this.filteredData = null;
      return;
    }

    const { filters, isNewClient } = event;
    this.isNewClient = isNewClient;

    if (!filters) {
      console.log('Resetting filters. Showing all clinics.');
      this.filteredClinics = [...this.clinics];
    } else {
      this.filteredClinics = await this.filterClinics(this.clinics, filters);

      if (isNewClient) {
        const filterData = this.prepareFilterData(
          filters,
          this.filteredClinics
        );
        this.filteredData = filterData;
        this.saveFilteredDataToDatabase(filterData);
      }
    }

    this.sortClinics();
  }

  private async filterClinics(clinics: any[], filters: { [key: string]: any }): Promise<any[]> {
    const hasSelectedFilters = (filterGroup: any) =>
      Object.values(filterGroup || {}).some(Boolean);

    let coordinates: { lat: number, lng: number } | null = null;
    const postalCodeFilter = filters['postalCodesServe'];
    
    if (postalCodeFilter) {
      coordinates = await this.geocodePostalCode(postalCodeFilter);
    }

    return clinics.filter((clinic) => {
      const matchesServiceDelivery =
        (filters['serviceDeliveryModes']?.inPerson &&
          clinic.clinicTypes?.includes('In person')) ||
        (filters['serviceDeliveryModes']?.virtual &&
          clinic.clinicTypes?.includes('Virtual')) ||
        (filters['serviceDeliveryModes']?.byAppointment &&
          clinic.clinicTypes?.includes('By appointment')) ||
        (filters['serviceDeliveryModes']?.walkIn &&
          clinic.clinicTypes?.includes('Walk-in')) ||
        (filters['serviceDeliveryModes']?.dropOff &&
          clinic.clinicTypes?.includes('Drop-off')) ||
        !hasSelectedFilters(filters['serviceDeliveryModes']);

      const matchesSupportedTaxYears =
        (filters['supportedTaxYears']?.currentYear &&
          clinic.taxYearsPrepared?.includes('Current Year')) ||
        (filters['supportedTaxYears']?.currentLastYears &&
          clinic.taxYearsPrepared?.includes('Current and last year')) ||
        (filters['supportedTaxYears']?.multipleYears &&
          clinic.taxYearsPrepared?.includes('Multiple years')) ||
        !hasSelectedFilters(filters['supportedTaxYears']);

      const matchesProvinces =
        (filters['provinces']?.Ontario &&
          clinic.residencyTaxYear.toLowerCase().includes('ontario')) ||
        (filters['provinces']?.Quebec &&
          (clinic.residencyTaxYear.toLowerCase().includes('quebec') ||
            clinic.residencyTaxYear.toLowerCase().includes('québec'))) ||
        (filters['provinces']?.Other &&
          (clinic.residencyTaxYear
            .toLowerCase()
            .includes('Any province other than Ontario and Quebec') ||
            clinic.residencyTaxYear
              .toLowerCase()
              .includes('autres que l’ontario et le québec'))) ||
        !hasSelectedFilters(filters['provinces']);

      const matchesLanguage =
        (filters['languageOptions']?.french &&
          clinic.serviceLanguages?.includes('French')) ||
        (filters['languageOptions']?.english &&
          clinic.serviceLanguages?.includes('English')) ||
        (filters['languageOptions']?.arabic &&
          clinic.serviceLanguages?.includes('Arabic')) ||
        (filters['languageOptions']?.other &&
          filters['languageOptions']?.otherLanguage &&
          clinic.serviceLanguages
            ?.toLowerCase()
            .includes(
              filters['languageOptions'].otherLanguage.toLowerCase()
            )) ||
        !hasSelectedFilters(filters['languageOptions']);

      const matchesClient =
        (filters['clientCategories']?.newcomers &&
          clinic.populationServed?.includes('Newcomers')) ||
        (filters['clientCategories']?.students &&
          clinic.populationServed?.includes('Students')) ||
        (filters['clientCategories']?.indigenousClients &&
          clinic.populationServed?.includes(
            'Indigenous (First Nations and Inuit and Metis)'
          )) ||
        (filters['clientCategories']?.seniors &&
          clinic.populationServed?.includes('Seniors')) ||
        (filters['clientCategories']?.disabilities &&
          clinic.populationServed?.includes('Persons with disabilities')) ||
        (filters['clientCategories']?.languageSpecific &&
          clinic.populationServed?.includes('Language-specific community')) ||
        (filters['clientCategories']?.other &&
          filters['clientCategories']?.otherClientCategory &&
          clinic.populationServed
            ?.toLowerCase()
            .includes(
              filters['clientCategories'].otherClientCategory.toLowerCase()
            )) ||
        !hasSelectedFilters(filters['clientCategories']);

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

      const matchesAppointmentAvailability =
        (filters['appointmentType'] === 'Yes' &&
          clinic.appointmentAvailability === 'Yes') ||
        (filters['appointmentType'] === 'No' &&
          clinic.appointmentAvailability === 'No') ||
        (filters['appointmentType'] === 'Not Sure' &&
          clinic.appointmentAvailability === 'Not Sure') ||
        filters['appointmentType'] === '';

      const matchesWheelchairAccessible =
        (filters['wheelchairAccessible'] === 'Yes' &&
          clinic.wheelchairAccessible === 'Yes') ||
        (filters['wheelchairAccessible'] === 'No' &&
          clinic.appointmentAvailability === 'No') ||
        filters['wheelchairAccessible'] === '';

      const matchesDaysOfOperation =
        (filters['serviceDays']?.weekdays &&
          clinic.daysOfOperation.includes('Weekdays')) ||
        (filters['serviceDays']?.weekends &&
          clinic.daysOfOperation.includes('Weekends')) ||
        (!filters['serviceDays']?.weekdays &&
          !filters['serviceDays']?.weekends);

      const matcheshoursOfOperation =
        (filters['serviceHours']?.daytime &&
          clinic.hoursOfOperation.includes('Daytime')) ||
        (filters['serviceHours']?.evening &&
          clinic.hoursOfOperation.includes('Evening')) ||
        (!filters['serviceHours']?.daytime &&
          !filters['serviceHours']?.evening);

      const matchesSpecialTaxCases =
        (filters['specialTaxCases']?.rentalIncome &&
          clinic.servePeople?.includes('Rental income')) ||
        (filters['specialTaxCases']?.selfEmployment &&
          clinic.servePeople?.includes('Self-employment income')) ||
        (filters['specialTaxCases']?.incomeOver &&
          clinic.servePeople?.includes('Interest income over 1000$')) ||
        (filters['specialTaxCases']?.deceasedPerson &&
          clinic.servePeople?.includes('Return for a deceased person')) ||
        (filters['specialTaxCases']?.employmentExpenses &&
          clinic.servePeople?.includes(
            'Employment expenses (with specific conditions)'
          )) ||
        (filters['specialTaxCases']?.capitalGains &&
          clinic.servePeople?.includes(
            'Capital Gains/losses (with specific conditions)'
          )) ||
        (filters['specialTaxCases']?.largerIncome &&
          clinic.servePeople?.includes(
            'Larger income than CVITP income-criteria. when people are low income now'
          )) ||
        (filters['specialTaxCases']?.other &&
          filters['specialTaxCases']?.otherSpecialTaxCases &&
          clinic.servePeople
            ?.toLowerCase()
            .includes(
              filters['specialTaxCases'].otherSpecialTaxCases.toLowerCase()
            )) ||
        !hasSelectedFilters(filters['specialTaxCases']);

        const matchesPostalCode = !postalCodeFilter || (coordinates && 
          clinic.catchmentBoundaries?.features?.some((feature: any) => {
            if (feature.geometry?.type === 'Polygon' && feature.geometry.coordinates) {
              const polygonCoordinates = feature.geometry.coordinates[0];
              const point: [number, number] = [coordinates.lng, coordinates.lat];
              return this.isPointInPolygon(point, polygonCoordinates);
            }
            return false;
          }));

      return (
        matchesSupportedTaxYears &&
        matchesProvinces &&
        matchesLanguage &&
        matchesClient &&
        matchesAccessDocuments &&
        matchesServiceDelivery &&
        matchesAppointmentAvailability &&
        matchesWheelchairAccessible &&
        matchesDaysOfOperation &&
        matcheshoursOfOperation &&
        matchesSpecialTaxCases &&
        matchesPostalCode
      );
    });
  }

  prepareFilterData(
    filters: { [key: string]: any },
    filteredClinics: any[]
  ): any {
    const serviceDeliveryModesMap = {
      inPerson: 'In-Person',
      virtual: 'Virtual',
      byAppointment: 'By Appointment',
      walkIn: 'Walk-In',
      dropOff: 'Drop-Off',
    };
    const supportedTaxYearsMap = {
      currentYear: 'Only Current Year',
      currentLastYears: 'Current and last year',
      multipleYears: 'Multiple Years',
    };
    const provincesMap = {
      Ontario: 'Ontario',
      Quebec: 'Quebec',
      Other: 'Any province other than Ontario and Quebec',
    };
    const specialTaxCasesMap = {
      rentalIncome: 'Rental Income',
      selfEmployment: 'Self-employment income',
      incomeOver: 'Interest income over 1000$',
      deceasedPerson: 'Return for a deceased person',
      employmentExpenses: 'Employment expenses (with specific conditions)',
      capitalGains: 'Capital Gains/losses (with specific conditions)',
      largerIncome:
        'Larger income than CVITP income-criteria. when people are low income now',
      other: 'Other Special Cases',
    };
    const clientCategoriesMap = {
      newcomers: 'Newcomers',
      students: 'Students',
      indigenousClients: 'Indigenous (First Nations and Inuit and Metis)',
      seniors: 'Seniors',
      disabilities: 'Persons with disabilities',
      languageSpecific: 'Language-specific community',
    };
    const accessDocumentsMap = {
      allDocuments: 'Yes for CRA documents with Autofill/repid',
      someDocuments:
        'Yes with help from staff or volunteer for some documentation',
      noDocuments: 'No, client must have all their documents ready',
    };

    const organizationNames = filteredClinics
      .map((clinic) => clinic.organizationName)
      .join(', ');
    return {
      appointment_type: filters['appointmentType'] || '',
      type_of_clinic: this.extractTrueValues(
        filters['serviceDeliveryModes'],
        serviceDeliveryModesMap
      ),
      wheelchair_accessible: filters['wheelchairAccessible'] || '',

      days_of_operation: this.extractTrueValues(filters['serviceDays'], {
        weekdays: 'Weekdays',
        weekends: 'Weekends',
      }),
      hours_of_operation: this.extractTrueValues(filters['serviceHours'], {
        daytime: 'Daytime',
        evening: 'Evening',
      }),
      supported_tax_years: this.extractTrueValues(
        filters['supportedTaxYears'],
        supportedTaxYearsMap
      ),
      province_of_residence: this.extractTrueValues(
        filters['provinces'],
        provincesMap
      ),
      language_options: this.extractTrueValues(
        filters['languageOptions'],
        {
          french: 'French',
          english: 'English',
          arabic: 'Arabic',
          other: 'Other Language',
        },
        'otherLanguage'
      ),
      population_serve: this.extractTrueValues(
        filters['clientCategories'],
        clientCategoriesMap
      ),
      help_access_documents: this.extractTrueValues(
        filters['accessDocuments'],
        accessDocumentsMap
      ),
      special_cases: this.extractTrueValues(
        filters['specialTaxCases'],
        specialTaxCasesMap,
        'otherSpecialTaxCases'
      ),
      client_postal_code: filters['postalCodesServe'],
      clinics_listed: organizationNames || '',
      assigned_clinic: '',
      unassigned_clinic: '',
      created_by: this.userEmail,
      created_date: new Date().toISOString(),
    };
  }

  extractTrueValues(
    obj: Record<string, boolean> | string,
    valueMap: Record<string, string>,
    otherKey?: string,
    filters?: any
  ): string {
    if (!obj) return '';

    if (typeof obj === 'string') {
      if (obj === 'other' && otherKey && filters[otherKey]) {
        return filters[otherKey];
      }
      return valueMap[obj] || '';
    }

    if (typeof obj === 'object') {
      return Object.keys(obj)
        .filter((key) => {
          return (
            obj[key] === true || (otherKey && key === 'other' && obj[otherKey])
          );
        })
        .map((key) => {
          if (key === 'other' && otherKey && obj[otherKey]) {
            return obj[otherKey];
          }
          return valueMap[key] || '';
        })
        .join(', ');
    }

    return '';
  }

  saveFilteredDataToDatabase(filterData: any) {
    this.clinicService.saveFilteredData(filterData).subscribe(
      (response) => {
        this.newClientId = response.client_id;
        console.log('Filtered data saved successfully', response);
      },
      (error) => {
        console.error('Error saving filtered data', error);
      }
    );
  }

  private async geocodePostalCode(postalCode: string): Promise<{ lat: number, lng: number } | null> {
    try {
      const response: any = await this.http.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${environment.googleMapsApiKey}`
      ).toPromise();

      if (response.status === 'OK' && response.results.length > 0) {
        return response.results[0].geometry.location;
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  private isPointInPolygon(point: [number, number], polygon: number[][]): boolean {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  onLanguageChange(language: string): void {
    this.currentLanguage = language;
  }

  onFilterSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onAssignClinic(clinic: Clinic) {
    console.log('assigned clinic');
    if (this.isNewClient && this.newClientId) {
      this.filteredData.assigned_clinic = clinic.organizationName;
      this.filteredData.client_id = this.newClientId;
      this.clinicService
        .updateFilteredData(this.newClientId, this.filteredData)
        .subscribe(() => {
          this.isNewClient = false;
          this.newClientId = '';
          console.log('Clinic assigned successfully.');
        });
    }
  }

  onUnassignClinic(clinic: Clinic) {
    console.log('unassigned clinic');
    if (this.isNewClient && this.newClientId) {
      this.filteredData.unassigned_clinic = clinic.organizationName;
      this.filteredData.client_id = this.newClientId;
      this.clinicService
        .updateFilteredData(this.newClientId, this.filteredData)
        .subscribe(() => {
          console.log('Clinic unassigned successfully.');
        });
    }
  }
}
