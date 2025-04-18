import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import * as L from 'leaflet';
import axios from 'axios';
import { PostalCodeService } from '../../services/postal-code.service';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() clinics: Clinic[] = [];
  @Input() selectedTab!: string;
  private map!: L.Map;
  private markers: L.LayerGroup = L.layerGroup();
  public isLoading = false;
  private isMapInitialized = false;
  public selectedClinic?: Clinic;
  public showModal = false;

  constructor(private postalCodeService: PostalCodeService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();
      this.isMapInitialized = true;
      this.updateMap();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isMapInitialized) return;

    if (changes['clinics']) {
      this.updateMap();
    }

    if (changes['selectedTab'] && this.selectedTab === 'access-filter') {
      this.updateMap();
    }
  }

  private initializeMap(): void {
    const defaultLat = 45.424721;
    const defaultLng = -75.695;
    const defaultZoom = 12;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/media/marker-icon-2x.png',
      iconUrl: '/media/marker-icon.png',
      shadowUrl: '/media/marker-shadow.png',
    });

    this.map = L.map('map', {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);

    this.markers.addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  private async updateMap(): Promise<void> {
    this.isLoading = true;
    if (!this.map) return;

    this.markers.clearLayers();

    const bounds: L.LatLngBounds = L.latLngBounds([]);

    for (const clinic of this.clinics) {
      try {
        const location = clinic.locations[0];
        if (!location) {
          continue;
        }
        const fullAddress = `${location.street}, ${location.city}, ${location.state}, ${location.postalCode}`;

        const { lat, lng } = await this.postalCodeService.getCoordinates(fullAddress);

        const clinicLatLng = L.latLng(lat, lng);

        const marker = L.marker(clinicLatLng).bindPopup(`
          <strong>${clinic.organizationName}</strong><br>
          Address: ${fullAddress}<br>
          Type: ${clinic.clinicTypes || 'N/A'}<br>
          Language: ${clinic.serviceLanguages || 'N/A'}<br>
          <a href="#" class="open-modal" data-clinic-id="${clinic.id}">More Details</a>
        `);
  
        marker.on('popupopen', (event) => {
          setTimeout(() => {
            const link = document.querySelector(`.open-modal[data-clinic-id="${clinic.id}"]`);
            if (link) {
              link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(clinic);
              });
            }
          }, 0);
        });

        this.markers.addLayer(marker);

        bounds.extend(clinicLatLng);
      } catch (error) {
        console.error(
          `Failed to geocode address for clinic "${clinic.organizationName}":`,
          error
        );
      }
    }

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      this.map.setView([45.424721, -75.695], 12);
    }

    this.isLoading = false;
  }

  openModal(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
    this.selectedClinic = undefined;
  }
}
