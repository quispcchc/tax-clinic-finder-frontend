import { Component, OnInit } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-tax-clinic-management',
  standalone: false,

  templateUrl: './tax-clinic-management.component.html',
  styleUrl: './tax-clinic-management.component.scss'
})
export class TaxClinicManagementComponent implements OnInit {
  taxClinics: Clinic[] = [];
  filteredTaxClinics: Clinic[] = [];
  searchQuery: string = '';

  constructor(private clinicService: ClinicService) { }

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
    this.filteredTaxClinics = this.taxClinics.filter(clinic =>
      clinic.organizationName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
