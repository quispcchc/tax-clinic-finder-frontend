import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-clinic-list',
  standalone: false,
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.scss']
})
export class ClinicListComponent {
  @Input() clinics: any[] = [];
}
