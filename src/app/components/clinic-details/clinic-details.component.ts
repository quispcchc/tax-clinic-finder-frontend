import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import * as L from 'leaflet';
import axios from 'axios';
import { PostalCodeService } from '../../services/postal-code.service';

@Component({
  selector: 'app-clinic-details',
  standalone: false,
  templateUrl: './clinic-details.component.html',
  styleUrls: ['./clinic-details.component.scss'],
})
export class ClinicDetailsComponent implements OnInit, AfterViewInit {
  @Input() clinic: Clinic | undefined;
  @Output() closeModal = new EventEmitter<void>();
  @Output() assignClinic = new EventEmitter<Clinic>();
  @Output() unassignClinic = new EventEmitter<Clinic>();
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  private map!: L.Map;
  private markers: L.LayerGroup = L.layerGroup();
  private boundaryLayer: L.LayerGroup = L.layerGroup();

  constructor(private postalCodeService: PostalCodeService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();
      this.updateClinicLocation();
      this.map.invalidateSize();
    }, 0);

    window.addEventListener('resize', () => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  private initializeMap(): void {
    this.map = L.map('clinic-map', {
      center: [45.424721, -75.695],
      zoom: 12,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);

    this.markers.addTo(this.map);
    this.boundaryLayer.addTo(this.map);
  }

  private async updateClinicLocation(): Promise<void> {
    if (!this.clinic || this.clinic.locations.length === 0) return;

    const location = this.clinic.locations[0];
    const fullAddress = `${location.street}, ${location.city}, ${location.state}, ${location.postalCode}`;

    try {
      const { lat, lng } = await this.postalCodeService.getCoordinates(fullAddress);
      const clinicLatLng = L.latLng(lat, lng);

      this.map.setView(clinicLatLng, 15);
      this.markers.clearLayers();

      L.marker(clinicLatLng).addTo(this.markers).bindPopup(`
        <strong>${this.clinic.organizationName}</strong><br>
        ${fullAddress}<br>
        Type: ${this.clinic.clinicTypes || 'N/A'}<br>
        Language: ${this.clinic.serviceLanguages || 'N/A'}
      `);

      await this.updateCatchmentAreaBoundary();
    } catch (error) {
      console.error(`Error geocoding clinic address:`, error);
    }
  }

  private async updateCatchmentAreaBoundary(): Promise<void> {
    if (!this.clinic || !this.clinic.catchmentBoundaries) return;

    this.boundaryLayer.clearLayers();

    let geoJsonData;

    if (typeof this.clinic.catchmentBoundaries === 'string') {
      try {
        geoJsonData = JSON.parse(this.clinic.catchmentBoundaries);
      } catch (error) {
        console.error('Error parsing catchmentBoundaries:', error);
        return;
      }
    } else {
      geoJsonData = this.clinic.catchmentBoundaries;
    }

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: {
        color: '#007E94',
        fillColor: '#007E94',
        weight: 2,
        fillOpacity: 0.3,
      },
    }).addTo(this.boundaryLayer);

    this.map.fitBounds(geoJsonLayer.getBounds());
  }

  referClinic() {
    if (this.clinic) {
      this.assignClinic.emit(this.clinic);
      this.closeModal.emit();
    }
  }

  backToFilterClinic() {
    if (this.clinic) {
      this.unassignClinic.emit(this.clinic);
    }
    this.toggleSidebarEvent.emit();
    this.closeModal.emit();
  }
}
