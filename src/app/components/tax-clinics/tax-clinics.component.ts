import { Component, Input } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-tax-clinics',
  standalone: false,
  templateUrl: './tax-clinics.component.html',
  styleUrl: './tax-clinics.component.scss'
})
export class TaxClinicsComponent {
  @Input() clinics: Clinic[] = [];
  @Input() language!: string;
}
