import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-tax-clinic-modal',
  standalone: false,

  templateUrl: './tax-clinic-modal.component.html',
  styleUrl: './tax-clinic-modal.component.scss',
})
export class TaxClinicModalComponent {
  @Input() isOpen = false;
  @Input() clinic: Clinic = {
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

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() clinicSaved = new EventEmitter<void>();

  constructor(private clinicService: ClinicService) {}

  saveClinic() {
    if (this.clinic.id) {
      this.clinicService
        .updateTaxClinic(this.clinic.id, this.clinic)
        .subscribe(() => {
          this.clinicSaved.emit();
          this.closeModal();
        });
    } else {
      this.clinicService.addTaxClinic(this.clinic).subscribe(() => {
        this.clinicSaved.emit();
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
