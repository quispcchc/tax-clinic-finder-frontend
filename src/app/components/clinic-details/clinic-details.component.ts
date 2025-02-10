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
      const { lat, lng } = await this.geocodeAddress(fullAddress);
      const clinicLatLng = L.latLng(lat, lng);

      this.map.setView(clinicLatLng, 15);
      this.markers.clearLayers();

      L.marker(clinicLatLng).addTo(this.markers).bindPopup(`
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
    const coordinates = await this.postalCodeService.geocodePostalCodes(
      postalCodes
    ); // Use the service

    if (coordinates.length < 3) return;

    const boundaryPoints = this.computeConvexHull(coordinates);

    this.boundaryLayer.clearLayers();
    const boundaryPolygon = L.polygon(boundaryPoints, {
      color: '#007E94',
      fillColor: '#007E94',
      weight: 2,
      fillOpacity: 0.3,
    }).addTo(this.boundaryLayer);

    this.map.fitBounds(boundaryPolygon.getBounds());
  }

  private extractPostalCodes(catchmentArea: string): string[] {
    const match = catchmentArea.match(/([A-Z]\d[A-Z] ?\d[A-Z]\d)/g);
    return match ? [...new Set(match.map((pc) => pc.replace(/\s/, '')))] : [];
  }

  private async geocodeAddress(
    address: string
  ): Promise<{ lat: number; lng: number }> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${this.postalCodeService['GOOGLE_MAPS_API_KEY']}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].geometry.location;
      } else {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  private computeConvexHull(points: [number, number][]): [number, number][] {
    points.sort(([ax, ay], [bx, by]) => (ax !== bx ? ax - bx : ay - by));

    const crossProduct = (
      a: [number, number],
      b: [number, number],
      c: [number, number]
    ) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

    const hull: [number, number][] = [];
    for (const point of points) {
      while (
        hull.length >= 2 &&
        crossProduct(hull[hull.length - 2], hull[hull.length - 1], point) <= 0
      ) {
        hull.pop();
      }
      hull.push(point);
    }

    return hull;
  }

  assignClinic() {
    console.log('Assign Clinic button clicked');
  }
  
  filterClinic() {
    console.log('Back to Filter Clinic button clicked');
  }
  
}
