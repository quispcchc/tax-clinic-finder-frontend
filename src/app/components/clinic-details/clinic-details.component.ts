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

  private postalCodeCache: { [key: string]: [number, number] } = {};

  private map!: L.Map;
  private markers: L.LayerGroup = L.layerGroup();
  //private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyBc3mEkYs8ZzYf5onUt4vi5jjsQ6cogV40';
  private readonly GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

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
    if (!this.clinic || this.clinic.locations.length === 0) return;

    const location = this.clinic.locations[0];
    const fullAddress = `${location.street}, ${location.city}, ${location.state}, ${location.postalCode}`;

    try {
      const { lat, lng } = await this.geocodeAddress(fullAddress);
      const clinicLatLng = L.latLng(lat, lng);

      this.map.setView(clinicLatLng, 15);
      this.markers.clearLayers();

      L.marker(clinicLatLng).addTo(this.map).bindPopup(`
        <strong>${this.clinic.organizationName}</strong><br>
        ${fullAddress}<br>
        Type: ${this.clinic.clinicTypes || 'N/A'}<br>
        Language: ${this.clinic.serviceLanguages || 'N/A'}<br>
        Catchment area: ${this.clinic.catchmentArea || 'N/A'}
      `);

      await this.updateCatchmentAreaBoundary(this.clinic.catchmentArea);
    } catch (error) {
      console.error(`Error geocoding clinic address:`, error);
    }
  }

  private async updateCatchmentAreaBoundary(
    catchmentArea: string
  ): Promise<void> {
    if (!catchmentArea) return;

    const postalCodes = this.extractPostalCodes(catchmentArea);
    const coordinates = await this.geocodePostalCodes(postalCodes);

    if (coordinates.length === 0) return;

    const boundaryPolygon = L.polygon(coordinates, {
      color: '#007E94',
      fillColor: '#007E94',
      weight: 2,
      fillOpacity: 0.3,
    }).addTo(this.map);

    this.map.fitBounds(boundaryPolygon.getBounds());
  }

  private extractPostalCodes(catchmentArea: string): string[] {
    const match = catchmentArea.match(/([A-Z]\d[A-Z] ?\d[A-Z]\d)/g);
    return match ? match.map((pc) => pc.replace(/\s/, '')) : [];
  }

  private async geocodePostalCodes(
    postalCodes: string[]
  ): Promise<[number, number][]> {
    const coordinates: [number, number][] = [];

    for (const postalCode of postalCodes) {
      if (this.postalCodeCache[postalCode]) {
        coordinates.push(this.postalCodeCache[postalCode]);
        continue;
      }

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            postalCode + ', Canada'
          )}&key=${this.GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.status === 'OK' && response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          this.postalCodeCache[postalCode] = [lat, lng];
          coordinates.push([lat, lng]);
        }
      } catch (error) {
        console.error(`Error geocoding postal code ${postalCode}:`, error);
      }
    }

    return coordinates;
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
