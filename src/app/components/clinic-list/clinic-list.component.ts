import { Component, Input } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinic-list',
  standalone: false,
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.scss']
})
export class ClinicListComponent {

  @Input() clinics: Clinic[] = [];
  showModal: boolean = false;
  selectedClinic: Clinic | undefined;

  openModal(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClinic = undefined;
  }
}
