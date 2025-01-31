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
        }, 100000);
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
}
