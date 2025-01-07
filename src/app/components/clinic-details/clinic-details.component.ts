import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinic-details',
  standalone: false,
  
  templateUrl: './clinic-details.component.html',
  styleUrl: './clinic-details.component.scss'
})
export class ClinicDetailsComponent {
  @Input() clinic: Clinic | undefined;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
