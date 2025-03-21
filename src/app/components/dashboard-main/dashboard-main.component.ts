import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
          eligibilityCriteriaFile: clinic.eligibility_criteria_file,
          otherBranches: clinic.other_branches,
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

  sortClinics(postalCodeFilter?: string, coordinates?: { lat: number, lng: number }) {
    const appointmentPriority: Record<string, number> = { 'Yes': 1, 'No': 2, 'Might be available soon': 3 };
  
    const populationPriority: Record<string, number> = {
      'newcomers': 1,
      'seniors': 2,
      'persons with disabilities': 3,
      'students': 4,
      'indigenous (first nations and inuit and metis)': 5,
      'language-specific community': 6
    };
  
    const doesClinicServePostalCode = (clinic: any): boolean => {
      if (!postalCodeFilter || !coordinates) return false;
      return clinic.catchmentBoundaries?.features?.some((feature: any) => {
        if (feature.geometry?.type === 'Polygon' && feature.geometry.coordinates) {
          const polygonCoordinates = feature.geometry.coordinates[0];
          const point: [number, number] = [coordinates.lng, coordinates.lat];
          return this.isPointInPolygon(point, polygonCoordinates);
        }
        return false;
      }) ?? false;
    };
  
    const getPopulationPriority = (clinic: any) => {
      if (!clinic.populationServed) return 99;
      const populations = clinic.populationServed.toLowerCase().split(', ');
      for (const population of populations) {
        if (populationPriority[population]) {
          return populationPriority[population];
        }
      }
      return 99;
    };
  
    this.filteredClinics.sort((a, b) => {
      const priorityA = appointmentPriority[a.appointmentAvailability] ?? 4;
      const priorityB = appointmentPriority[b.appointmentAvailability] ?? 4;
      if (priorityA !== priorityB) return priorityA - priorityB;
  
      const servesPostalA = doesClinicServePostalCode(a) ? 0 : 1;
      const servesPostalB = doesClinicServePostalCode(b) ? 0 : 1;
      if (servesPostalA !== servesPostalB) return servesPostalA - servesPostalB;
  
      const popPriorityA = getPopulationPriority(a);
      const popPriorityB = getPopulationPriority(b);
      return popPriorityA - popPriorityB;
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

    let coordinates: { lat: number, lng: number } | undefined = undefined;

    if (filters && filters['postalCodesServe']) {
      const result = await this.geocodePostalCode(filters['postalCodesServe']);
      coordinates = result ? { lat: result.lat, lng: result.lng } : undefined;
    }

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

    this.sortClinics(filters?.['postalCodesServe'], coordinates);
  }

  private async filterClinics(clinics: any[], filters: { [key: string]: any }): Promise<any[]> {
    const hasSelectedFilters = (filterGroup: any) =>
      Object.values(filterGroup || {}).some(Boolean);

    if (filters['lowIncome'] === 'No') {
      return [];
    }

    let coordinates: { lat: number, lng: number } | null = null;
    const postalCodeFilter = filters['postalCodesServe'];
    
    if (postalCodeFilter) {
      coordinates = await this.geocodePostalCode(postalCodeFilter);
    }

    return clinics.filter((clinic) => {
      const matchesServiceDelivery =
        (filters['serviceDeliveryModes']?.inPerson &&
          (clinic.clinicTypes?.toLowerCase().includes('in person') ||
          clinic.clinicTypes?.toLowerCase().includes('en présentiel'))) ||
        (filters['serviceDeliveryModes']?.virtual &&
          (clinic.clinicTypes?.toLowerCase().includes('virtual') ||
          clinic.clinicTypes?.toLowerCase().includes('virtuelle'))) ||
        (filters['serviceDeliveryModes']?.byAppointment &&
          (clinic.clinicTypes?.toLowerCase().includes('by appointment') ||
          clinic.clinicTypes?.toLowerCase().includes('sur rendez-vous'))) ||
        (filters['serviceDeliveryModes']?.walkIn &&
          clinic.clinicTypes?.toLowerCase().includes('walk-in')) ||
        (filters['serviceDeliveryModes']?.dropOff &&
          (clinic.clinicTypes?.toLowerCase().includes('drop-off') ||
          clinic.clinicTypes?.toLowerCase().includes('dépôt des documents'))) ||
        !hasSelectedFilters(filters['serviceDeliveryModes']);

      const matchesSupportedTaxYears =
        (filters['supportedTaxYears']?.toLowerCase() === 'only current year' &&
          (clinic.taxYearsPrepared?.toLowerCase() === 'only current year' || clinic.taxYearsPrepared?.toLowerCase() === 'année en cours seule')) ||
        (filters['supportedTaxYears']?.toLowerCase() === 'current and last year' &&
          (clinic.taxYearsPrepared?.toLowerCase() === 'current and last year' || clinic.taxYearsPrepared?.toLowerCase() === 'année en cours et dernière année')) ||
        (filters['supportedTaxYears']?.toLowerCase() === 'multiple years' &&
          (clinic.taxYearsPrepared?.toLowerCase() === 'multiple years' || clinic.taxYearsPrepared?.toLowerCase() === 'plusieurs années')) ||
        filters['supportedTaxYears'] === '';


      const matchesProvinces =
        (filters['provinces']?.ontario &&
          clinic.residencyTaxYear.toLowerCase().includes('ontario')) ||
        (filters['provinces']?.quebec &&
          (clinic.residencyTaxYear.toLowerCase().includes('quebec') ||
          clinic.residencyTaxYear.toLowerCase().includes('québec'))) ||
        (filters['provinces']?.other &&
          filters['provinces']?.otherProvince &&
          clinic.residencyTaxYear?.toLowerCase().includes(filters['provinces'].otherProvince.toLowerCase()) &&
          !clinic.residencyTaxYear.toLowerCase().includes('any province other than ontario and quebec') &&
          !clinic.residencyTaxYear.toLowerCase().includes('toute autre province que l\'ontario et le québec')) ||
        (filters['provinces']?.other &&
          filters['provinces']?.otherProvince &&
          (clinic.residencyTaxYear?.toLowerCase().includes('any province other than ontario and quebec') ||
          clinic.residencyTaxYear?.toLowerCase().includes('toute autre province que l\'ontario et le québec')) &&
          filters['provinces'].otherProvince.toLowerCase() !== 'ontario' && 
          filters['provinces'].otherProvince.toLowerCase() !== 'quebec') ||
          !hasSelectedFilters(filters['provinces']);
        
      const matchesLanguage =
        (filters['languageOptions']?.french &&
          (clinic.serviceLanguages?.toLowerCase().includes('french') || 
          clinic.serviceLanguages?.toLowerCase().includes('français'))) ||
        (filters['languageOptions']?.english &&
          (clinic.serviceLanguages?.toLowerCase().includes('english') ||
          clinic.serviceLanguages?.toLowerCase().includes('anglais'))) ||
        (filters['languageOptions']?.arabic &&
          (clinic.serviceLanguages?.toLowerCase().includes('arabic') ||
          clinic.serviceLanguages?.toLowerCase().includes('arabe'))) ||
        (filters['languageOptions']?.other &&
          filters['languageOptions']?.otherLanguage &&
          clinic.serviceLanguages?.toLowerCase().includes(filters['languageOptions'].otherLanguage.toLowerCase())) ||
        !hasSelectedFilters(filters['languageOptions']);

      const matchesClient =
        (filters['clientCategories']?.newcomers &&
          (clinic.populationServed?.toLowerCase().includes('newcomers') ||
          clinic.populationServed?.toLowerCase().includes('nouveaux arrivants'))) ||
        (filters['clientCategories']?.students &&
          (clinic.populationServed?.toLowerCase().includes('students') ||
          clinic.populationServed?.toLowerCase().includes('étudiants'))) ||
        (filters['clientCategories']?.indigenousClients &&
          (clinic.populationServed?.toLowerCase().includes('indigenous (first nations and inuit and metis)') ||
          clinic.populationServed?.toLowerCase().includes('autochtones (premières nations et inuits et métis)'))) ||
        (filters['clientCategories']?.seniors &&
          (clinic.populationServed?.toLowerCase().includes('seniors') ||
          clinic.populationServed?.toLowerCase().includes('personnes âgées'))) ||
        (filters['clientCategories']?.disabilities &&
          (clinic.populationServed?.toLowerCase().includes('persons with disabilities') ||
          clinic.populationServed?.toLowerCase().includes('personnes en situation de handicap'))) ||
        (filters['clientCategories']?.languageSpecific &&
          (clinic.populationServed?.toLowerCase().includes('language-specific community') ||
          clinic.populationServed?.toLowerCase().includes('communauté spécifique à une langue'))) ||
        (filters['clientCategories']?.other &&
          filters['clientCategories']?.otherClientCategory &&
          clinic.populationServed
            ?.toLowerCase()
            .includes(
              filters['clientCategories'].otherClientCategory.toLowerCase()
            )) ||
        !hasSelectedFilters(filters['clientCategories']);

      const matchesWheelchairAccessible =
        (filters['wheelchairAccessible'] === 'Yes' &&
          (clinic.wheelchairAccessible === 'Yes' || clinic.wheelchairAccessible === 'Oui')) ||
        (filters['wheelchairAccessible'] === 'No' &&
          (clinic.wheelchairAccessible === 'No' || clinic.wheelchairAccessible === 'Non')) ||
        filters['wheelchairAccessible'] === '';

      const matchesDaysOfOperation =
        (filters['serviceDays']?.weekdays &&
          (clinic.daysOfOperation.toLowerCase().includes('weekdays') ||
          clinic.daysOfOperation.toLowerCase().includes('jours de la semaine'))) ||
        (filters['serviceDays']?.weekends &&
          (clinic.daysOfOperation.toLowerCase().includes('weekends') ||
          clinic.daysOfOperation.toLowerCase().includes('weekends'))) ||
        (!filters['serviceDays']?.weekdays &&
          !filters['serviceDays']?.weekends);

      const matcheshoursOfOperation =
        (filters['serviceHours']?.daytime &&
          (clinic.hoursOfOperation.toLowerCase().includes('daytime') ||
          clinic.hoursOfOperation.toLowerCase().includes('heures de bureau'))) ||
        (filters['serviceHours']?.evening &&
          (clinic.hoursOfOperation.toLowerCase().includes('evening') ||
          clinic.hoursOfOperation.toLowerCase().includes('soirée'))) ||
        (!filters['serviceHours']?.daytime &&
          !filters['serviceHours']?.evening);

      const matchesSpecialTaxCases =
        (filters['specialTaxCases']?.rentalIncome &&
          (clinic.servePeople?.toLowerCase().includes('rental income') ||
          clinic.servePeople?.toLowerCase().includes('revenus locatifs'))) ||
        (filters['specialTaxCases']?.selfEmployment &&
          (clinic.servePeople?.toLowerCase().includes('self-employment income') ||
          clinic.servePeople?.toLowerCase().includes("revenu d'un travail indépendant"))) ||
        (filters['specialTaxCases']?.incomeOver &&
          (clinic.servePeople?.toLowerCase().includes('interest income over 1000$') ||
          clinic.servePeople?.toLowerCase().includes("revenu d'intérêts supérieur à 1000$"))) ||
        (filters['specialTaxCases']?.deceasedPerson &&
          (clinic.servePeople?.toLowerCase().includes('return for a deceased person') ||
          clinic.servePeople?.toLowerCase().includes('déclarations pour une personne décédée'))) ||
        (filters['specialTaxCases']?.employmentExpenses &&
          (clinic.servePeople?.toLowerCase().includes('employment expenses (with specific conditions)') ||
          clinic.servePeople?.toLowerCase().includes("dépenses d’emploi (sous conditions spécifiques)"))) ||
        (filters['specialTaxCases']?.capitalGains &&
          (clinic.servePeople?.toLowerCase().includes('capital gains/losses (with specific conditions)') ||
          clinic.servePeople?.toLowerCase().includes('gains/pertes en capital (avec conditions spécifiques)'))) ||
        (filters['specialTaxCases']?.largerIncome &&
          (clinic.servePeople?.toLowerCase().includes('larger income than cvitp income-criteria. when people are low income now') ||
          clinic.servePeople?.toLowerCase().includes('revenu supérieur aux critères de revenu du cvitp. lorsque les personnes ont un faible revenu actuellement'))) ||
        (filters['specialTaxCases']?.other &&
          filters['specialTaxCases']?.otherSpecialTaxCases &&
          clinic.servePeople
            ?.toLowerCase()
            .includes(
              filters['specialTaxCases'].otherSpecialTaxCases.toLowerCase()
            )) ||
        !hasSelectedFilters(filters['specialTaxCases']);

        const matchesPostalCode = !postalCodeFilter || 
          !clinic.catchmentBoundaries ||
          (coordinates && clinic.catchmentBoundaries?.features?.some((feature: any) => {
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
        matchesServiceDelivery &&
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

    const organizationNames = filteredClinics
      .map((clinic) => clinic.organizationName)
      .join(', ');
    return {
      type_of_clinic: this.extractTrueValues(
        filters['serviceDeliveryModes'],
        serviceDeliveryModesMap
      ),
      low_income: filters['lowIncome'] || '',
      wheelchair_accessible: filters['wheelchairAccessible'] || '',
      days_of_operation: this.extractTrueValues(filters['serviceDays'], {
        weekdays: 'Weekdays',
        weekends: 'Weekends',
      }),
      hours_of_operation: this.extractTrueValues(filters['serviceHours'], {
        daytime: 'Daytime',
        evening: 'Evening',
      }),
      supported_tax_years: filters['supportedTaxYears'] || '',
      province_of_residence: this.extractTrueValues(
        filters['provinces'],
        {
          ontario: 'Ontario',
          quebec: 'Quebec',
          other: 'Other Province',
        },
        'otherProvince'
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
        clientCategoriesMap,
        'otherClientCategory'
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

  onNewClientChange(newValue: boolean) {
    this.isNewClient = newValue;
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
          this.onFilterSidebarToggle();
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
