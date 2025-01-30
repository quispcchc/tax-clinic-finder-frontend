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

  constructor(private clinicService: ClinicService) {}

  ngOnInit() {
    if (this.clinic && this.clinic.appointmentAvailability) {
      this.appointmentAvailability = this.clinic.appointmentAvailability;
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  updateAppointmentAvailability() {
    if (!this.clinic?.id) {
      console.error('Clinic data is missing');
      return;
    }

    const updatedData = {
      id: this.clinic.id,
      appointmentAvailability: this.appointmentAvailability,
    };

    this.clinicService.updateAppointmentAvailability(updatedData).subscribe(
      (response) => {
        console.log('Update successful', response);
        alert('Appointment Availability updated successfully!');
        if (this.clinic) {
          this.clinic.appointmentAvailability = this.appointmentAvailability;
        }
      },
      (error) => {
        console.error('Update failed', error);
        alert('Failed to update. Please try again.');
      }
    );
  }
}
