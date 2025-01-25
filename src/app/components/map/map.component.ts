import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import * as L from 'leaflet';
import axios from 'axios';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() clinics: Clinic[] = [];
  @Input() selectedTab!: string;
  private map!: L.Map;
  private markers: L.LayerGroup = L.layerGroup();
  public isLoading = false;
  private isMapInitialized = false;

  //private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyBc3mEkYs8ZzYf5onUt4vi5jjsQ6cogV40';
  private readonly GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

  ngOnInit(): void {
    // Any initialization logic that doesn't require the DOM to be fully loaded
  }

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
    const defaultLng = -75.695000;
    const defaultZoom = 12;

    // Initialize the map
    this.map = L.map('map', {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom,
      attributionControl: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);

    // Add the marker layer group to the map
    this.markers.addTo(this.map);

    // Ensure the map resizes correctly
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  private async updateMap(): Promise<void> {
    this.isLoading = true;
    if (!this.map) return;

    // Clear existing markers and layers
    this.markers.clearLayers();

    // Define bounds for all clinics
    const bounds: L.LatLngBounds = L.latLngBounds([]);

    for (const clinic of this.clinics) {
      try {

        const location = clinic.locations[0];
        // Generate full address for geocoding
        const fullAddress = `${location.street}, ${location.city}, ${location.state}, ${location.postalCode}`;

        // Geocode the clinic address to get latitude and longitude
        const { lat, lng } = await this.geocodeAddress(fullAddress);

        const clinicLatLng = L.latLng(lat, lng);

        // Add marker for the clinic
        const marker = L.marker(clinicLatLng).bindPopup(`
          <strong>${clinic.organizationName}</strong><br>
          ${fullAddress}<br>
          Type: ${clinic.clinicTypes || 'N/A'}<br>
          Language: ${clinic.serviceLanguages || 'N/A'}
        `);

        // Add marker to the layer group
        this.markers.addLayer(marker);

        // Extend map bounds to include this clinic
        bounds.extend(clinicLatLng);
      } catch (error) {
        console.error(`Failed to geocode address for clinic "${clinic.organizationName}":`, error);
      }
    }

    // Adjust map view to fit all clinics or reset to default if no clinics
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      this.map.setView([45.424721, -75.695000], 12); // Default view if no valid clinics
    }

    this.isLoading = false;
  }

  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
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
      console.error(`Error geocoding address: ${address}`, error);
      throw error;
    }
  }
}
