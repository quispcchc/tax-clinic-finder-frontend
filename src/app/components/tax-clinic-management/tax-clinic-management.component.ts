import { Component, OnInit } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-tax-clinic-management',
  standalone: false,

  templateUrl: './tax-clinic-management.component.html',
  styleUrl: './tax-clinic-management.component.scss',
})
export class TaxClinicManagementComponent implements OnInit {
  taxClinics: Clinic[] = [];
  filteredTaxClinics: Clinic[] = [];
  searchQuery: string = '';
  showClinicDetailsModal: boolean = false;
  currentLanguage: string;
  //selectedClinic: Clinic | undefined;

  isDeleteModalOpen: boolean = false;
  taxClinicToDeleteId: number | null = null;

  showClinicModal = false;
  selectedClinic: Clinic = {
    id: 0,
    organizationName: '',
    organizationContact: '',
    contactPersonName: '',
    contactPersonTitle: '',
    contactEmail: '',
    appointmentAvailability: '',
    listedOnCra: '',
    visibleOnNceo: '',
    alternateContactName: '',
    alternateContactEmail: '',
    alternateContactTitle: '',
    alternateContactPhone: '',
    publicInfo: '',
    clinicTypes: '',
    wheelchairAccessible: false,
    servePeopleFrom: '',
    catchmentArea: '',
    monthsOffered: '',
    hoursOfOperation: '',
    yearRoundService: false,
    populationServed: '',
    serviceLanguages: '',
    taxYearsPrepared: '',
    residencyTaxYear: '',
    servePeople: '',
    eligibilityCriteriaWebpage: '',
    bookingProcess: '',
    bookingDaysHours: '',
    bookingContactPhone: '',
    bookingContactEmail: '',
    onlineBookingLink: '',
    usefulOnlineBooking: '',
    requiredDocuments: '',
    helpWithMissingDocs: '',
    taxPreparers: '',
    taxFilers: '',
    volunteerRoles: '',
    clinicCapacity: '',
    additionalSupport: '',
    comments: '',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    locations: [],
  };

  constructor(private clinicService: ClinicService, 
      private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  ngOnInit(): void {
    this.loadTaxClinics();
  }

  loadTaxClinics(): void {
    this.clinicService.getTaxClinics().subscribe(
      (data: any[]) => {
        this.taxClinics = data.map((clinic) => ({
          id: clinic.id,
          organizationName: clinic.organization_name,
          organizationContact: clinic.organization_contact,
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
          hoursOfOperation: clinic.hours_of_operation,
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

        this.filteredTaxClinics = [...this.taxClinics];
        console.log('the clinic details are....', this.filteredTaxClinics);
      },
      (error) => {
        console.error('Failed to load tax clinics:', error);
      }
    );
  }

  filterClinics() {
    this.filteredTaxClinics = this.taxClinics.filter((clinic) =>
      clinic.organizationName
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  openClinicDetailsModal(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.showClinicDetailsModal = true;
  }

  closeClinicDetailsModal(): void {
    this.showClinicDetailsModal = false;
    this.selectedClinic = {
      id: 0,
      organizationName: '',
      organizationContact: '',
      contactPersonName: '',
      contactPersonTitle: '',
      contactEmail: '',
      appointmentAvailability: '',
      listedOnCra: '',
      visibleOnNceo: '',
      alternateContactName: '',
      alternateContactEmail: '',
      alternateContactTitle: '',
      alternateContactPhone: '',
      publicInfo: '',
      clinicTypes: '',
      wheelchairAccessible: false,
      servePeopleFrom: '',
      catchmentArea: '',
      monthsOffered: '',
      hoursOfOperation: '',
      yearRoundService: false,
      populationServed: '',
      serviceLanguages: '',
      taxYearsPrepared: '',
      residencyTaxYear: '',
      servePeople: '',
      eligibilityCriteriaWebpage: '',
      bookingProcess: '',
      bookingDaysHours: '',
      bookingContactPhone: '',
      bookingContactEmail: '',
      onlineBookingLink: '',
      usefulOnlineBooking: '',
      requiredDocuments: '',
      helpWithMissingDocs: '',
      taxPreparers: '',
      taxFilers: '',
      volunteerRoles: '',
      clinicCapacity: '',
      additionalSupport: '',
      comments: '',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      locations: [],
    };
  }

  confirmDelete(taxClinicId: number) {
    this.isDeleteModalOpen = true;
    this.taxClinicToDeleteId = taxClinicId;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.taxClinicToDeleteId = null;
  }

  openAddClinicModal(): void {
    this.selectedClinic = {
      id: 0,
      organizationName: '',
      organizationContact: '',
      contactPersonName: '',
      contactPersonTitle: '',
      contactEmail: '',
      appointmentAvailability: '',
      listedOnCra: '',
      visibleOnNceo: '',
      alternateContactName: '',
      alternateContactEmail: '',
      alternateContactTitle: '',
      alternateContactPhone: '',
      publicInfo: '',
      clinicTypes: '',
      wheelchairAccessible: false,
      servePeopleFrom: '',
      catchmentArea: '',
      monthsOffered: '',
      hoursOfOperation: '',
      yearRoundService: false,
      populationServed: '',
      serviceLanguages: '',
      taxYearsPrepared: '',
      residencyTaxYear: '',
      servePeople: '',
      eligibilityCriteriaWebpage: '',
      bookingProcess: '',
      bookingDaysHours: '',
      bookingContactPhone: '',
      bookingContactEmail: '',
      onlineBookingLink: '',
      usefulOnlineBooking: '',
      requiredDocuments: '',
      helpWithMissingDocs: '',
      taxPreparers: '',
      taxFilers: '',
      volunteerRoles: '',
      clinicCapacity: '',
      additionalSupport: '',
      comments: '',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      locations: [],
    };
    this.showClinicModal = true;
  }

  // Open modal to edit a clinic
  openEditClinicModal(clinic: Clinic): void {
    this.selectedClinic = { ...clinic };
    this.showClinicModal = true;
  }

  // Close modal
  closeClinicModal(): void {
    this.showClinicModal = false;
  }

  // Reload clinics after adding/editing
  onClinicSaved(): void {
    this.loadTaxClinics();
    this.closeClinicModal();
  }

  deleteTaxClinic() {
    if (this.taxClinicToDeleteId !== null) {
      this.clinicService.deleteTaxClinic(this.taxClinicToDeleteId).subscribe(
        () => {
          this.taxClinics = this.taxClinics.filter(
            (clinic) => clinic.id !== this.taxClinicToDeleteId
          );
          this.filteredTaxClinics = [...this.taxClinics];
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
}
