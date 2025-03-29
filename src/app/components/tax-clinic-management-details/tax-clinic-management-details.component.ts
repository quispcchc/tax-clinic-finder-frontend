import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-tax-clinic-management-details',
  standalone: false,
  
  templateUrl: './tax-clinic-management-details.component.html',
  styleUrl: './tax-clinic-management-details.component.scss'
})
export class TaxClinicManagementDetailsComponent implements OnInit {
 @Input() clinic: Clinic | undefined;
  @Output() closeModal = new EventEmitter<void>();

  appointmentAvailability: string = '';
  initialAppointmentAvailability: string = '';
  showMessagePopup: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  isSaveButtonDisabled: boolean = true;

  constructor(private clinicService: ClinicService) { }

  ngOnInit() {
    if (this.clinic && this.clinic.appointmentAvailability) {
      this.appointmentAvailability = this.clinic.appointmentAvailability;
      this.initialAppointmentAvailability = this.clinic.appointmentAvailability;
    }
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

  getFormattedArray(value: string | string[] | undefined): string[] {
    if (!value) {
      return [];
    }
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim());
    } else if (Array.isArray(value)) {
      return value;
    }
    return [];
  }
}
