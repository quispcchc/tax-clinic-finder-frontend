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

  isDeleteModalOpen: boolean = false;
  taxClinicToDeleteId: number | null = null;
  isEditMode: boolean = false;

  popupMessage: string = '';
  popupVisible: boolean = false;
  popupType: 'success' | 'error' = 'success';

  showClinicModal = false;
  selectedClinic: Clinic = {
    id: 0,
    organizationName: '',
    organisationWebsite: '',
    organisationalEmail: '',
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
    clinicTypes: [],
    wheelchairAccessible: '',
    servePeopleFrom: '',
    catchmentArea: '',
    monthsOffered: [],
    hoursAndDate: '',
    hoursOfOperation: [],
    daysOfOperation: [],
    yearRoundService: '',
    populationServed: [],
    serviceLanguages: [],
    taxYearsPrepared: [],
    residencyTaxYear: [],
    servePeople: [],
    eligibilityCriteriaWebpage: '',
    eligibilityCriteriaFile: '',
    otherBranches: '',
    bookingProcess: [],
    bookingDaysHours: '',
    bookingContactPhone: '',
    bookingContactEmail: '',
    onlineBookingLink: '',
    usefulOnlineBooking: '',
    requiredDocuments: '',
    helpWithMissingDocs: [],
    taxPreparers: [],
    taxFilers: [],
    volunteerRoles: [],
    clinicCapacity: '',
    additionalSupport: [],
    comments: '',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    locations: [],
    isVirtualClinic: false
  };

  constructor(
    private clinicService: ClinicService,
    private languageService: LanguageService
  ) {
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
          clinicTypes: this.convertStringToArray(clinic.clinic_types),
          wheelchairAccessible: clinic.wheelchair_accessible,
          servePeopleFrom: clinic.serve_people_from,
          catchmentArea: clinic.catchment_area,
          monthsOffered: this.convertStringToArray(clinic.months_offered),
          hoursAndDate: clinic.date_and_time_of_operation,
          hoursOfOperation: this.convertStringToArray(
            clinic.hours_of_operation
          ),
          daysOfOperation: this.convertStringToArray(clinic.days_of_operation),
          yearRoundService: clinic.year_round_service,
          populationServed: this.convertStringToArray(clinic.population_served),
          serviceLanguages: this.convertStringToArray(clinic.service_languages),
          taxYearsPrepared: this.convertStringToArray(
            clinic.tax_years_prepared
          ),
          residencyTaxYear: this.convertStringToArray(
            clinic.residency_tax_year
          ),
          servePeople: this.convertStringToArray(clinic.serve_people),
          eligibilityCriteriaWebpage: clinic.eligibility_criteria_webpage,
          eligibilityCriteriaFile: clinic.eligibility_criteria_file,
          otherBranches: clinic.other_branches,
          bookingProcess: this.convertStringToArray(clinic.booking_process),
          bookingDaysHours: clinic.booking_days_hours,
          bookingContactPhone: clinic.booking_contact_phone,
          bookingContactEmail: clinic.booking_contact_email,
          onlineBookingLink: clinic.online_booking_link,
          usefulOnlineBooking: clinic.useful_online_booking,
          requiredDocuments: clinic.required_documents,
          helpWithMissingDocs: this.convertStringToArray(
            clinic.help_with_missing_docs
          ),
          taxPreparers: this.convertStringToArray(clinic.tax_preparers),
          taxFilers: this.convertStringToArray(clinic.tax_filers),
          volunteerRoles: this.convertStringToArray(clinic.volunteer_roles),
          clinicCapacity: clinic.clinic_capacity,
          additionalSupport: this.convertStringToArray(
            clinic.additional_support
          ),
          comments: clinic.comments,
          createdDate: clinic.created_at,
          updatedDate: clinic.updated_at,
          isVirtualClinic: clinic.is_virtual_clinic,
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
        this.showPopup('Failed to load tax clinics', 'error');
      }
    );
  }

  convertStringToArray(value: string): string[] {
    return value ? value.split(', ') : [];
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
      organisationWebsite: '',
      organisationalEmail: '',
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
      clinicTypes: [],
      wheelchairAccessible: '',
      servePeopleFrom: '',
      catchmentArea: '',
      monthsOffered: [],
      hoursAndDate: '',
      hoursOfOperation: [],
      daysOfOperation: [],
      yearRoundService: '',
      populationServed: '',
      serviceLanguages: [],
      taxYearsPrepared: [],
      residencyTaxYear: [],
      servePeople: [],
      eligibilityCriteriaWebpage: '',
      eligibilityCriteriaFile: '',
      otherBranches: '',
      bookingProcess: [],
      bookingDaysHours: '',
      bookingContactPhone: '',
      bookingContactEmail: '',
      onlineBookingLink: '',
      usefulOnlineBooking: '',
      requiredDocuments: '',
      helpWithMissingDocs: [],
      taxPreparers: [],
      taxFilers: [],
      volunteerRoles: [],
      clinicCapacity: '',
      additionalSupport: [],
      comments: '',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      locations: [],
      isVirtualClinic: false
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
      organisationWebsite: '',
      organisationalEmail: '',
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
      clinicTypes: [],
      wheelchairAccessible: '',
      servePeopleFrom: '',
      catchmentArea: '',
      monthsOffered: [],
      hoursAndDate: '',
      hoursOfOperation: [],
      daysOfOperation: [],
      yearRoundService: '',
      populationServed: [],
      serviceLanguages: [],
      taxYearsPrepared: [],
      residencyTaxYear: [],
      servePeople: [],
      eligibilityCriteriaWebpage: '',
      eligibilityCriteriaFile: '',
      otherBranches: '',
      bookingProcess: [],
      bookingDaysHours: '',
      bookingContactPhone: '',
      bookingContactEmail: '',
      onlineBookingLink: '',
      usefulOnlineBooking: '',
      requiredDocuments: '',
      helpWithMissingDocs: [],
      taxPreparers: [],
      taxFilers: [],
      volunteerRoles: [],
      clinicCapacity: '',
      additionalSupport: [],
      comments: '',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      locations: [],
      isVirtualClinic: false
    };
    this.isEditMode = false;
    this.showClinicModal = true;
  }

  openEditClinicModal(clinic: Clinic): void {
    this.selectedClinic = { ...clinic };
    console.log("selectedclinic to the edit is....", JSON.stringify(this.selectedClinic));
    this.isEditMode = true;
    this.showClinicModal = true;
  }

  closeClinicModal(): void {
    this.showClinicModal = false;
  }

  onClinicSaved(): void {
    this.loadTaxClinics();
    this.closeClinicModal();
  }

  mapFrontendToBackend(clinic: Clinic): any {
    return {
      id: clinic.id,
      organization_name: clinic.organizationName,
      organisation_website: clinic.organisationWebsite,
      organisation_email: clinic.organisationalEmail,
      contact_person_name: clinic.contactPersonName,
      contact_person_title: clinic.contactPersonTitle,
      contact_email: clinic.contactEmail,
      appointment_available: clinic.appointmentAvailability,
      listed_on_cra: clinic.listedOnCra,
      visible_on_nceo: clinic.visibleOnNceo,
      alternate_contact_name: clinic.alternateContactName,
      alternate_contact_email: clinic.alternateContactEmail,
      alternate_contact_phone: clinic.alternateContactPhone,
      alternate_contact_title: clinic.alternateContactTitle,
      public_info: clinic.publicInfo,
      clinic_types: clinic.clinicTypes,
      wheelchair_accessible: clinic.wheelchairAccessible,
      serve_people_from: clinic.servePeopleFrom,
      catchment_area: clinic.catchmentArea,
      months_offered: clinic.monthsOffered,
      date_and_time_of_operation: clinic.hoursAndDate,
      hours_of_operation: clinic.hoursOfOperation,
      days_of_operation: clinic.daysOfOperation,
      year_round_service: clinic.yearRoundService,
      population_served: clinic.populationServed,
      service_languages: clinic.serviceLanguages,
      tax_years_prepared: clinic.taxYearsPrepared,
      residency_tax_year: clinic.residencyTaxYear,
      serve_people: clinic.servePeople,
      eligibility_criteria_webpage: clinic.eligibilityCriteriaWebpage,
      eligibility_criteria_file: clinic.eligibilityCriteriaFile,
      other_branches: clinic.otherBranches,
      booking_process: clinic.bookingProcess,
      booking_days_hours: clinic.bookingDaysHours,
      booking_contact_phone: clinic.bookingContactPhone,
      booking_contact_email: clinic.bookingContactEmail,
      online_booking_link: clinic.onlineBookingLink,
      useful_online_booking: clinic.usefulOnlineBooking,
      required_documents: clinic.requiredDocuments,
      help_with_missing_docs: clinic.helpWithMissingDocs,
      tax_preparers: clinic.taxPreparers,
      tax_filers: clinic.taxFilers,
      volunteer_roles: clinic.volunteerRoles,
      clinic_capacity: clinic.clinicCapacity,
      additional_support: clinic.additionalSupport,
      comments: clinic.comments,
      created_at: clinic.createdDate,
      updated_at: clinic.updatedDate,
      is_virtual_clinic: clinic.isVirtualClinic,
      locations: clinic.isVirtualClinic ? [] : 
      Array.isArray(clinic.locations)
      ? clinic.locations.map((location: any) => ({
          id: location.id,
          tax_clinic_id: location.taxClinicId,
          street: location.street,
          city: location.city,
          state: location.state,
          postal_code: location.postalCode,
          created_at: location.updatedDate,
        }))
      : [],
    };
  }

  mapBackendToFrontend(clinic: any): any {
    const mappedClinic = {
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
      createdDate: clinic.created_at,
      updatedDate: clinic.updated_at,
      isVirtualClinic: clinic.is_virtual_clinic,
      locations: clinic.locations
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
    };

    return mappedClinic;
  }

  saveClinic(clinic: Clinic) {
    if (this.isEditMode) {
      const clinicData = this.mapFrontendToBackend(clinic); 
      this.clinicService.updateTaxClinic(clinicData.id, clinicData).subscribe(
        
        (updatedClinic) => {
          const backendClinic = this.mapBackendToFrontend(updatedClinic);
          this.taxClinics = this.taxClinics.map((u) =>
            u.id === backendClinic.id ? backendClinic : u
          );
          this.filteredTaxClinics = [...this.taxClinics];
          this.closeClinicModal();
          this.showPopup('Clinic updated successfully!', 'success');
        },
        (error) => {
          console.error('Error updating clinic:', error);
          this.showPopup('Failed to update clinic', 'error');
        }
      );
    } else {
      const { ...clinicToCreate }: Clinic = clinic;
      this.clinicService.addTaxClinic(clinicToCreate).subscribe({
        next: (newClinic) => {
          const frontendClinic = this.mapBackendToFrontend(newClinic);

          this.taxClinics.push(frontendClinic);
          this.filteredTaxClinics = [...this.taxClinics];
          this.closeClinicModal();
          this.showPopup('Clinic added successfully!', 'success');
        },
        error: (error) => {
          console.error('Error adding clinic:', error);
          this.showPopup('Failed to add clinic', 'error');
        },
      });
    }
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
          this.showPopup('Tax Clinic deleted successfully!', 'success');
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.showPopup('Failed to delete Tax Clinic', 'error');
        }
      );
    }
  }

  showPopup(message: string, type: 'success' | 'error') {
    this.popupMessage = message;
    this.popupType = type;
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
  }
}
