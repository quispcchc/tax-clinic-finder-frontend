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

@Component({
  selector: 'app-clinic-details',
  standalone: false,
  templateUrl: './clinic-details.component.html',
  styleUrls: ['./clinic-details.component.scss'],
})
export class ClinicDetailsComponent implements OnInit, AfterViewInit {
  @Input() clinic: Clinic | undefined;
  @Output() closeModal = new EventEmitter<void>();

  private map!: L.Map;
  private markers: L.LayerGroup = L.layerGroup();
  //private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyBc3mEkYs8ZzYf5onUt4vi5jjsQ6cogV40';
  private readonly GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

  ngOnInit(): void {
    // Initialization logic if needed
  }

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
    const defaultLat = 45.424721;
    const defaultLng = -75.695;
    const defaultZoom = 12;

    this.map = L.map('clinic-map', {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);

    this.markers.addTo(this.map);
  }

  private async updateClinicLocation(): Promise<void> {
    if (!this.clinic) return;

    const fullAddress = `${this.clinic.street}, ${this.clinic.city}, ${this.clinic.state}, ${this.clinic.postalcode}`;

    try {
      const { lat, lng } = await this.geocodeAddress(fullAddress);
      const clinicLatLng = L.latLng(lat, lng);

      this.map.setView(clinicLatLng, 15);

      this.markers.clearLayers();

      L.marker(clinicLatLng).addTo(this.map).bindPopup(`
          <strong>${this.clinic.name}</strong><br>
          ${fullAddress}<br>
          Type: ${this.clinic.appointmentType || 'N/A'}<br>
          Language: ${this.clinic.languageRequirements || 'N/A'}
        `);

      const circle = L.circle(clinicLatLng, { radius: 5000 }).addTo(this.map);
    } catch (error) {
      console.error(
        `Error geocoding clinic address for "${this.clinic?.name}":`,
        error
      );
    }
  }

  private async geocodeAddress(
    address: string
  ): Promise<{ lat: number; lng: number }> {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0].geometry.location;
        return {
          lat: result.lat,
          lng: result.lng,
        };
      } else {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }
}
