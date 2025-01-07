import { Component, Input } from '@angular/core';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  @Input() clinics: Clinic[] = [];
  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 }; // Default center
  zoom = 10;

  ngOnChanges() {
    if (this.clinics.length > 0) {
      // Re-center the map to the first clinic's location
      this.center = { lat: this.clinics[0].lat, lng: this.clinics[0].lng };
    }
  }
}
