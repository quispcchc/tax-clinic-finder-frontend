import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinic-list',
  standalone: false,
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.scss'],
})
export class ClinicListComponent {
  @Input() clinics: Clinic[] = [];
  @Input() language!: string;
  @Input() isSidebarOpen: boolean = true;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() clinicSelected = new EventEmitter<Clinic>();
  @Output() assignClinic = new EventEmitter<Clinic>();
  @Output() unassignClinic = new EventEmitter<Clinic>();

  showModal: boolean = false;
  selectedClinic: Clinic | undefined;

  toggleFilterSidebar() {
    this.toggleSidebarEvent.emit();
  }

  openModal(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.showModal = true;
    this.clinicSelected.emit(clinic);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClinic = undefined;
  }

  onAssignClinic(clinic: Clinic) {
    this.assignClinic.emit(clinic);
    this.closeModal();
  }

  onUnassignClinic(clinic: Clinic) {
    this.unassignClinic.emit(clinic);
    this.closeModal();
  }

  getDotColor(appointmentAvailability: string): string {
    switch (appointmentAvailability) {
      case 'Yes':
        return 'green';
      case 'No':
        return 'red';
      case 'Not Sure':
        return 'orange';
      default:
        return 'gray';
    }
  }
}
