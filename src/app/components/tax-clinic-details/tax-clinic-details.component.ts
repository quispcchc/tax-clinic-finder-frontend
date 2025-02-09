import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-tax-clinic-details',
  standalone: false,

  templateUrl: './tax-clinic-details.component.html',
  styleUrl: './tax-clinic-details.component.scss',
})
export class TaxClinicDetailsComponent implements OnInit {
  @Input() clinic: Clinic | undefined;
  @Output() closeModal = new EventEmitter<void>();

  appointmentAvailability: string = '';
  initialAppointmentAvailability: string = '';
  showMessagePopup: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  isSaveButtonDisabled: boolean = true;

  clinicTypes: string[] = [];
  monthsOffered: string[] = [];
  hoursOfOperation: string[] = [];
  daysOfOperation: string[] = [];
  populationServed: string[] = [];
  serviceLanguages: string[] = [];
  taxYearsPrepared: string[] = [];
  residencyTaxYear: string[] = [];
  servePeople: string[] = [];
  bookingProcess: string[] = [];
  helpWithMissingDocs: string[] = [];
  taxPreparers: string[] = [];
  taxFilers: string[] = [];
  volunteerRoles: string[] = [];
  additionalSupport: string[] = [];

  constructor(private clinicService: ClinicService) { }

  ngOnInit() {
    if (this.clinic && this.clinic.appointmentAvailability) {
      this.appointmentAvailability = this.clinic.appointmentAvailability;
      this.initialAppointmentAvailability = this.clinic.appointmentAvailability;
    }

    if (this.clinic) {
      this.clinicTypes = this.convertStringToArray(this.clinic.clinicTypes);
      this.monthsOffered = this.convertStringToArray(this.clinic.monthsOffered);
      this.hoursOfOperation = this.convertStringToArray(this.clinic.hoursOfOperation);
      this.daysOfOperation = this.convertStringToArray(this.clinic.daysOfOperation);
      this.populationServed = this.convertStringToArray(this.clinic.populationServed);
      this.serviceLanguages = this.convertStringToArray(this.clinic.serviceLanguages);
      this.taxYearsPrepared = this.convertStringToArray(this.clinic.taxYearsPrepared);
      this.residencyTaxYear = this.convertStringToArray(this.clinic.residencyTaxYear);
      this.servePeople = this.convertStringToArray(this.clinic.servePeople);
      this.bookingProcess = this.convertStringToArray(this.clinic.bookingProcess);
      this.helpWithMissingDocs = this.convertStringToArray(this.clinic.helpWithMissingDocs);
      this.taxPreparers = this.convertStringToArray(this.clinic.taxPreparers);
      this.taxFilers = this.convertStringToArray(this.clinic.taxFilers);
      this.volunteerRoles = this.convertStringToArray(this.clinic.volunteerRoles);
      this.additionalSupport = this.convertStringToArray(this.clinic.additionalSupport);
    }
  }

  convertStringToArray(value: string | string[] | null | undefined): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    return value ? value.split(',').map(item => item.trim()) : [];
  }

  close(): void {
    this.closeModal.emit();
  }

  onAppointmentAvailabilityChange() {
    this.isSaveButtonDisabled = this.appointmentAvailability === this.initialAppointmentAvailability;
  }

  updateAppointmentAvailability() {
    if (!this.clinic?.id) {
      this.showMessagePopup = true;
      this.message = 'Clinic data is missing.';
      this.messageType = 'error';
      return;
    }

    const updatedData = {
      id: this.clinic.id,
      appointmentAvailability: this.appointmentAvailability,
    };

    this.clinicService.updateAppointmentAvailability(updatedData).subscribe(
      (response) => {
        this.showMessagePopup = true;
        this.message = 'Appointment Availability updated successfully!';
        this.messageType = 'success';
        setTimeout(() => {
          this.showMessagePopup = false;
        }, 3000);
        this.initialAppointmentAvailability = this.appointmentAvailability;
        this.isSaveButtonDisabled = true;
        if (this.clinic) {
          this.clinic.appointmentAvailability = this.appointmentAvailability;
        }
      },
      (error) => {
        this.showMessagePopup = true;
        this.message = 'Failed to update. Please try again.';
        this.messageType = 'error';
        setTimeout(() => {
          this.showMessagePopup = false;
        }, 3000);
      }
    );
  }

  closePopup() {
    this.showMessagePopup = false;
  }
}
